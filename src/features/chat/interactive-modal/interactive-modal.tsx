'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause } from 'lucide-react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useCommonCompute } from '@/hooks/use-compute';
import { TCommonPayload } from '@/types/common';
import { TASK_TYPE } from '@/constants/task';
import { useSession } from '@/libs/better-auth/client';
import { useParams } from 'next/navigation';

interface InteractiveModalProps {
  open: boolean;
  onClose?: () => void;
}

const InteractiveModal: React.FC<InteractiveModalProps> = ({
  open,
  onClose,
}) => {
  const [finalTranscript, setFinalTranscript] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const mutateInteractive = useCommonCompute();
  const { data: session } = useSession();
  const params = useParams<{ id: string }>();
  const partnerId = params.id;
  const userId = session?.user.id;
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleInteractive = useCallback(
    async (text: string) => {
      if (!userId || !partnerId) return;
      setIsLoading(true);
      setAudioSrc(null);
      try {
        const userText = text;
        // const userText = 'Giới thiệu về bạn đi';
        const payload: TCommonPayload = {
          task_type: TASK_TYPE.PARTNER_VOICE_SYNTHESIZE,
          input_args: {
            user_id: userId,
            partner_id: partnerId,
            generate_from_chat: false,
            user_message: userText,
          },
          priority: 'high',
        };
        const res = await mutateInteractive.mutateAsync(payload);
        console.log('mutateInteractive res:', res);
        if (res.result?.synthesis?.audio_base64) {
          const audioBase64 = res.result?.synthesis?.audio_base64;
          const audioFormat = res.result?.synthesis?.audio_format || 'wav';
          // Convert base64 to data URL
          const dataUrl = `data:audio/${audioFormat};base64,${audioBase64}`;
          setAudioSrc(dataUrl);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [mutateInteractive, userId, partnerId]
  );

  useEffect(() => {
    if (!listening && transcript) {
      // When recording stops, save the final transcript
      setFinalTranscript(transcript);
    }
  }, [listening, transcript]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      if (listening) {
        SpeechRecognition.stopListening();
      }
      resetTranscript();
      setFinalTranscript('');
      // Stop audio and reset audio state
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setAudioSrc(null);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [open, listening, resetTranscript]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc]);

  // Auto play audio when audioSrc is set
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, [audioSrc]);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleStartRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      console.error('Browser does not support speech recognition');
      return;
    }
    resetTranscript();
    setFinalTranscript('');
    // Reset audio when starting new recording
    setAudioSrc(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    SpeechRecognition.startListening({
      continuous: true,
      language: 'vi-VN',
    });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    // Get current transcript and debounce log after 1 second
    const currentTranscript = transcript || finalTranscript;
    if (currentTranscript) {
      console.log('currentTranscript:', currentTranscript);
      setFinalTranscript(currentTranscript);
      handleInteractive(currentTranscript);
    }
  };

  const handleMicClick = () => {
    if (listening) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[100vw] max-h-screen w-full h-full m-0 rounded-none p-6 flex flex-col"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>Interactive</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center">
          {!browserSupportsSpeechRecognition ? (
            <div className="text-center">
              <p className="text-lg text-destructive font-semibold">
                Your browser does not support recording feature
              </p>
            </div>
          ) : (
            <>
              {listening && (
                <div className="text-center">
                  <p className="text-2xl font-semibold text-primary animate-pulse">
                    Recording
                  </p>
                </div>
              )}
              {!listening && !isLoading && !audioSrc && (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Click the mic icon to start chatting
                  </p>
                </div>
              )}
              {isLoading && (
                <div className="text-center">
                  <p className="text-2xl font-semibold text-primary animate-pulse">
                    Waiting for response
                  </p>
                </div>
              )}
              {audioSrc && !listening && (
                <div className="text-center mt-4">
                  <audio ref={audioRef} src={audioSrc} />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayAudio}
                    className="h-12 w-12 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="size-5" />
                    ) : (
                      <Play className="size-5" />
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex justify-center pb-4">
          <Button
            variant="ghost"
            size="icon"
            className={`h-16 w-16 rounded-full ${
              listening
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            } ${
              !browserSupportsSpeechRecognition || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            }`}
            onClick={handleMicClick}
            disabled={!browserSupportsSpeechRecognition || isLoading}
          >
            {listening ? (
              <Square className="size-6 text-white" />
            ) : (
              <Mic className="size-6" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveModal;
