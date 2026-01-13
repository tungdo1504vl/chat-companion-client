'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Mic,
  Square,
  Play,
  Pause,
  Volume2,
  RotateCcw,
  X,
  MessageSquare,
} from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useCommonCompute } from '@/hooks/use-compute';
import { TCommonPayload } from '@/types/common';
import { TASK_TYPE } from '@/constants/task';
import { useSession } from '@/libs/better-auth/client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';

const PARTNER_AVATAR_MEN = '/images/partner-men.png';
const PARTNER_AVATAR_WOMEN = '/images/partner-women.jpeg';

interface InteractiveModalProps {
  open: boolean;
  onClose?: () => void;
  partnerName?: string;
  partnerAvatar?: string;
  partnerGender?: string;
}

const InteractiveModal: React.FC<InteractiveModalProps> = ({
  open,
  onClose,
  partnerName = 'Partner',
  partnerAvatar,
  partnerGender,
}) => {
  const [finalTranscript, setFinalTranscript] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
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
    } else {
      toast.info('No audio detected. Please try speaking again.');
    }
  };

  const handleMicClick = () => {
    if (listening) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const partnerAvatarUrl = useMemo(() => {
    if (!partnerAvatar) {
      return partnerGender === 'Male'
        ? PARTNER_AVATAR_MEN
        : PARTNER_AVATAR_WOMEN;
    }
    return partnerAvatar;
  }, [partnerAvatar, partnerGender]);

  const subjectName = useMemo(() => {
    if (partnerGender === 'Male') return 'HE';
    return 'SHE';
  }, [partnerGender]);

  // Audio visualization component
  const AudioVisualization = () => {
    const [heights, setHeights] = useState<number[]>([]);

    useEffect(() => {
      // Initialize heights
      const initialHeights = Array.from(
        { length: 20 },
        () => Math.random() * 60 + 20
      );
      setHeights(initialHeights);

      // Update heights periodically for animation
      const interval = setInterval(() => {
        setHeights(Array.from({ length: 20 }, () => Math.random() * 60 + 20));
      }, 150);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex items-end justify-center gap-1 h-12">
        {heights.map((height, index) => (
          <div
            key={index}
            className="w-1 bg-gray-300 rounded-full transition-all duration-150"
            style={{
              height: `${height}%`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[100vw] border-none max-h-screen w-full h-full m-0 rounded-none p-6 flex flex-col"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Title</DialogTitle>
        </VisuallyHidden>
        {/* Background Gradient - Purple when listening, brown otherwise */}
        <div
          className="absolute inset-0 z-0 transition-all duration-500"
          style={{
            background: listening
              ? 'linear-gradient(to bottom, #4A3A5C 0%, #2D1B3D 100%)'
              : 'radial-gradient(circle at 50% 30%, #5E3B32 0%, #261613 90%)',
          }}
        />

        {/* Recording UI - Show when listening */}
        {listening ? (
          <>
            {/* Top Section - Avatar with label */}
            <div className="relative pt-12 pb-8 z-10 flex flex-col items-center">
              {/* Close button in top right */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/20 transition-colors z-20"
                aria-label="Close"
              >
                <X className="size-5 text-gray-300" />
              </button>

              {/* Avatar with teal-blue frame */}
              <div className="relative w-32 h-32 mb-4">
                <div className="relative w-full h-full rounded-full p-1 border-2 border-[#7FB3D3]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {partnerAvatarUrl ? (
                      <img
                        src={partnerAvatarUrl}
                        alt={partnerName}
                        className="object-cover rounded-full w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-4xl font-semibold text-pink-700">
                        {partnerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Label */}
              <p className="text-xs uppercase text-gray-300 font-medium tracking-wider">
                SPEAKING AS {partnerName.toUpperCase()}
              </p>
            </div>

            {/* Middle Section - Prompt text */}
            <div className="flex-1 flex items-center justify-center z-10">
              <h2 className="text-4xl font-serif font-normal text-gray-100">
                Take your time.
              </h2>
            </div>

            {/* Bottom Section - Audio Visualization */}
            <div className="pb-[120px] z-10">
              <AudioVisualization />
            </div>
          </>
        ) : (
          <>
            {/* Top Section - Header with icon and prompt */}
            <div className="relative pt-8 px-6 pb-4 z-10">
              {/* Speech bubble icon in top right */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-200/30 flex items-center justify-center">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <MessageSquare className="size-5 text-gray-100" />
                </button>
              </div>

              {/* Main prompt */}
              <div className="text-center mt-4">
                <h1 className="text-3xl font-serif font-bold text-white mb-3">
                  Say it out loud.
                </h1>
                <p className="text-base font-serif italic text-white/90">
                  This is your space to practice — no pressure, no judgment.
                </p>
              </div>
            </div>

            {/* Middle Section - Partner Avatar */}
            <div className="flex-1 flex items-center justify-center px-6 py-8 z-10">
              <div
                className="relative"
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
              >
                {/* Circular frame with gradient border */}
                <div className="relative w-64 h-64 rounded-full p-1 bg-gradient-to-br from-[#C9A882] via-[#B8956F] to-[#8B6F47]">
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                    {partnerAvatarUrl ? (
                      <img
                        src={partnerAvatarUrl}
                        alt={partnerName}
                        className="object-cover rounded-full w-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-6xl font-semibold text-pink-700">
                        {partnerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Play/Pause overlay - only show when audioSrc exists and hovered */}
                  {audioSrc && (
                    <div
                      className={`absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
                        isAvatarHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <button
                        onClick={handlePlayAudio}
                        className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <Pause
                            className="size-8 text-[#5C4A3A]"
                            fill="#5C4A3A"
                          />
                        ) : (
                          <Play
                            className="size-8 text-[#5C4A3A]"
                            fill="#5C4A3A"
                          />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bottom Section - Controls - Only show when not recording */}
        {!listening && (
          <div className="pb-8 px-6 z-10">
            {!browserSupportsSpeechRecognition ? (
              <div className="text-center">
                <p className="text-lg text-white font-semibold">
                  Your browser does not support recording feature
                </p>
              </div>
            ) : (
              <>
                {/* Microphone Button */}
                <div className="flex flex-col items-center gap-3">
                  <Button
                    onClick={handleMicClick}
                    className={`h-20 min-h-20! w-20 rounded-full ${
                      listening
                        ? 'bg-[#C9A882] hover:bg-[#B8956F]'
                        : 'bg-[#D4B8A0] hover:bg-[#C9A882]'
                    } ${
                      !browserSupportsSpeechRecognition || isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    } shadow-lg transition-all active:scale-95`}
                    disabled={!browserSupportsSpeechRecognition || isLoading}
                  >
                    {listening ? (
                      <Square className="size-8 text-[#5C4A3A] animate-pulse" />
                    ) : (
                      <Mic className="size-8 text-[#5C4A3A]" />
                    )}
                  </Button>

                  {/* Instruction text - hide when loading */}
                  {!isLoading && (
                    <p className="text-xs uppercase text-white font-medium tracking-wider">
                      {listening
                        ? `RECORDING... CLICK TO STOP.`
                        : `CLICK TO SPEAK. ${subjectName}'S LISTENING.`}
                    </p>
                  )}

                  {/* Control icons */}
                  <div className="flex items-center gap-4 mt-2">
                    {/* Speaker/Volume icon */}
                    {audioSrc && (
                      <button
                        onClick={handlePlayAudio}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        aria-label="Play audio"
                      >
                        {isPlaying ? (
                          <Pause className="size-5 text-gray-300" />
                        ) : (
                          <Volume2 className="size-5 text-gray-300" />
                        )}
                      </button>
                    )}

                    {/* Refresh/Redo icon - disabled when loading */}
                    <button
                      onClick={() => {
                        resetTranscript();
                        setFinalTranscript('');
                        setAudioSrc(null);
                        if (audioRef.current) {
                          audioRef.current.pause();
                          audioRef.current.currentTime = 0;
                        }
                        setIsPlaying(false);
                      }}
                      disabled={isLoading}
                      className={`p-2 rounded-full transition-colors ${
                        isLoading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-white/20 cursor-pointer'
                      }`}
                      aria-label="Reset"
                    >
                      <RotateCcw className="size-5 text-gray-300" />
                    </button>

                    {/* Close icon */}
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Close"
                      disabled={isLoading}
                    >
                      <X className="size-5 text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Status messages */}
                {isLoading && (
                  <div className="text-center mt-4">
                    <p className="text-xl font-semibold text-white animate-pulse">
                      Waiting for response...
                    </p>
                  </div>
                )}

                {/* Hidden audio element */}
                {audioSrc && <audio ref={audioRef} src={audioSrc} />}
              </>
            )}
          </div>
        )}

        {/* Microphone Button - Always visible, positioned absolutely when recording */}
        {listening && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            {/* Cancel Button - Above the stop button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  SpeechRecognition.stopListening();
                  resetTranscript();
                  setFinalTranscript('');
                }}
                className="min-w-9 w-9 flex justify-center py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors"
                aria-label="Cancel"
              >
                <X className="size-5 text-gray-300" />
              </button>
              <Button
                onClick={handleMicClick}
                className="h-20 min-h-20! w-20 rounded-full bg-[#C9A882] hover:bg-[#B8956F] cursor-pointer shadow-lg transition-all active:scale-95"
              >
                <Square className="size-8 text-[#5C4A3A] animate-pulse" />
              </Button>
              <div className="min-w-9 w-9" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveModal;
