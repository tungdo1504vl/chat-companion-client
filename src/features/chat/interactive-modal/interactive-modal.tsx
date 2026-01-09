'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

interface InteractiveModalProps {
  open: boolean;
  onClose?: () => void;
}

const InteractiveModal: React.FC<InteractiveModalProps> = ({
  open,
  onClose,
}) => {
  const [finalTranscript, setFinalTranscript] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript) {
      // When recording stops, save the final transcript
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFinalTranscript('');
    }
  }, [open, listening, resetTranscript]);

  const handleStartRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      console.error('Browser does not support speech recognition');
      return;
    }
    resetTranscript();
    setFinalTranscript('');
    SpeechRecognition.startListening({
      continuous: true,
      language: 'vi-VN',
    });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    const result = transcript || finalTranscript;
    console.log('Recording result:', result);
    if (transcript) {
      setFinalTranscript(transcript);
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
        className="max-w-[100vw] max-h-[100vh] w-full h-full m-0 rounded-none p-6 flex flex-col"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>Interactive</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center">
          {!browserSupportsSpeechRecognition ? (
            <div className="text-center">
              <p className="text-lg text-destructive font-semibold">
                Trình duyệt của bạn không hỗ trợ tính năng ghi âm
              </p>
            </div>
          ) : (
            <>
              {listening && (
                <div className="text-center">
                  <p className="text-2xl font-semibold text-primary animate-pulse">
                    Đang ghi âm
                  </p>
                  {transcript && (
                    <p className="mt-4 text-muted-foreground">{transcript}</p>
                  )}
                </div>
              )}
              {!listening && finalTranscript && (
                <div className="text-center">
                  <p className="text-lg text-muted-foreground">
                    {finalTranscript}
                  </p>
                </div>
              )}
              {!listening && !finalTranscript && (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Nhấn vào icon mic để bắt đầu ghi âm
                  </p>
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
              !browserSupportsSpeechRecognition
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={handleMicClick}
            disabled={!browserSupportsSpeechRecognition}
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
