import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Square } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ChatInputProps {
  inputValue: string;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onChange,
  onKeyPress,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecordingRef = useRef(false);
  const finalTranscriptRef = useRef('');
  const initializedRef = useRef(false);

  useEffect(() => {
    // Check if Speech Recognition is supported
    if (typeof window === 'undefined' || initializedRef.current) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    let timeoutId: NodeJS.Timeout | null = null;

    if (!SpeechRecognition) {
      // isSupported is already false by default, no need to set it
      initializedRef.current = true;
      return;
    }

    // Defer setState to avoid cascading renders
    timeoutId = setTimeout(() => {
      setIsSupported(true);
    }, 0);

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const alternative = result[0];
        if (alternative) {
          const transcript = alternative.transcript;
          if (result.isFinal) {
            finalTranscriptRef.current += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
      }

      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'aborted') {
        // Auto-stop if no speech detected or aborted
        if (isRecordingRef.current) {
          recognition.stop();
          setIsRecording(false);
          isRecordingRef.current = false;
        }
      }
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        // Restart if still recording (handles auto-stop scenarios)
        try {
          recognition.start();
        } catch (error) {
          // Ignore errors when restarting
        }
      }
    };

    recognitionRef.current = recognition;
    initializedRef.current = true;

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;

    try {
      finalTranscriptRef.current = '';
      setTranscript('');
      setIsRecording(true);
      isRecordingRef.current = true;
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;

      // Set the transcript to the input
      const finalText = finalTranscriptRef.current.trim() || transcript.trim();
      if (finalText) {
        const syntheticEvent = {
          target: { value: finalText },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      finalTranscriptRef.current = '';
      setTranscript('');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 rounded-full blur-sm opacity-50" />
      {!isRecording ? (
        <Input
          value={inputValue}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Pour your heart out here ..."
          className={`h-12! relative z-10 w-full rounded-full border-0 bg-white/80 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/50 ${
            isSupported ? 'pr-12' : ''
          }`}
        />
      ) : (
        <div
          className={`relative z-10 w-full rounded-full border-0 bg-white/80 backdrop-blur-sm h-10 flex items-center px-4 ${
            isSupported ? 'pr-12' : ''
          }`}
        >
          <span className="text-sm text-muted-foreground">
            {transcript || 'Recording...'}
          </span>
        </div>
      )}
      {isSupported && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8"
          onClick={handleMicClick}
          type="button"
        >
          {isRecording ? (
            <Square className="size-4 text-destructive" />
          ) : (
            <Mic className="size-4 text-muted-foreground" />
          )}
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
