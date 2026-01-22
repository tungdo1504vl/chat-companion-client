import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUp, Mic, Send, Square, X } from 'lucide-react';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { AudioPlayer } from '@/components/commons/audio-player';
import {
  ChatInputProps,
  ChatInputData,
  ChatInputRef,
  ImageFile,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from './types';

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    { inputValue, disabled, onInputChange, onSendMessage, onDataChange },
    ref,
  ) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const [audioBase64, setAudioBase64] = useState<string | null>(null);
    const [recordedTranscript, setRecordedTranscript] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const shouldCreateAudioRef = useRef(true);
    const isRecordingRef = useRef(false);
    const finalTranscriptRef = useRef('');
    const initializedRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Expose reset methods via ref
    useImperativeHandle(ref, () => ({
      resetAudio: () => {
        setAudioBase64(null);
        setRecordedTranscript('');
      },
      resetImage: () => {
        // Revoke all ObjectURLs before clearing using functional update
        setImageFiles((prev) => {
          prev.forEach((imageFile) => {
            if (imageFile.preview) {
              URL.revokeObjectURL(imageFile.preview);
            }
          });
          return [];
        });
      },
    }));

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

    const startRecording = async () => {
      if (!recognitionRef.current) return;
      // Don't allow recording if images are uploaded
      if (imageFiles.length > 0) return;

      try {
        // Reset state and clear images/audio
        finalTranscriptRef.current = '';
        setTranscript('');
        setAudioBase64(null);
        setRecordedTranscript('');
        audioChunksRef.current = [];
        shouldCreateAudioRef.current = true;

        // Clear images when starting recording
        imageFiles.forEach((imageFile) => {
          URL.revokeObjectURL(imageFile.preview);
        });
        setImageFiles([]);

        // Start Speech Recognition
        setIsRecording(true);
        isRecordingRef.current = true;
        recognitionRef.current.start();

        // Start MediaRecorder for audio recording
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          mediaStreamRef.current = stream;
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.onstop = async () => {
            // Stop all tracks to release microphone
            if (mediaStreamRef.current) {
              mediaStreamRef.current
                .getTracks()
                .forEach((track) => track.stop());
              mediaStreamRef.current = null;
            }

            // Only create audio if flag is true and there are chunks
            if (
              shouldCreateAudioRef.current &&
              audioChunksRef.current.length > 0
            ) {
              const audioBlob = new Blob(audioChunksRef.current, {
                type: 'audio/webm',
              });

              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                setAudioBase64(base64String);
              };
              reader.readAsDataURL(audioBlob);
            }

            // Clear chunks after processing
            audioChunksRef.current = [];
          };

          mediaRecorder.start();
        } catch (error) {
          console.error('Error starting MediaRecorder:', error);
          // Continue with speech recognition even if MediaRecorder fails
        }
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsRecording(false);
        isRecordingRef.current = false;
      }
    };

    const stopRecording = () => {
      try {
        // Stop Speech Recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }

        // Check transcript before creating audio
        const finalText =
          finalTranscriptRef.current.trim() || transcript.trim();

        if (!finalText) {
          // No transcript - show warning and don't create audio file
          toast.warning('No speech detected. Please try speaking again.');

          // Set flag to prevent audio creation
          shouldCreateAudioRef.current = false;

          // Clear audio chunks to prevent audio creation
          audioChunksRef.current = [];

          // Stop MediaRecorder (onstop will check shouldCreateAudioRef)
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== 'inactive'
          ) {
            mediaRecorderRef.current.stop();
          }

          setIsRecording(false);
          isRecordingRef.current = false;
          finalTranscriptRef.current = '';
          setTranscript('');
          return;
        }

        // Has transcript - proceed normally to create audio file
        // Stop MediaRecorder (will trigger onstop handler to create audio)
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== 'inactive'
        ) {
          mediaRecorderRef.current.stop();
        }

        setIsRecording(false);
        isRecordingRef.current = false;

        // Save transcript to audioString instead of input
        setRecordedTranscript(finalText);

        // Don't set transcript to input - it will be passed via audioString in ChatInputData
        finalTranscriptRef.current = '';
        setTranscript('');
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
        isRecordingRef.current = false;
      }
    };

    const handleMicClick = () => {
      // Don't allow recording if images are uploaded
      if (imageFiles.length > 0 && !isRecording) return;

      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };

    const handleImageUpload = () => {
      // Don't allow upload if recording
      if (isRecording) return;
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      // Don't allow upload if recording
      if (isRecording) {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const selectedImageFiles = Array.from(files).filter((file) =>
        file.type.startsWith('image/'),
      );

      if (selectedImageFiles.length === 0) return;

      // Calculate how many files we can add (max 5 total)
      const currentCount = imageFiles.length;
      const remainingSlots = 5 - currentCount;
      const filesToAdd = selectedImageFiles.slice(0, remainingSlots);

      if (filesToAdd.length === 0) {
        // Already at max capacity
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Clear audio when uploading images
      setAudioBase64(null);
      setRecordedTranscript('');

      // Create ImageFile objects with both File and preview URL
      const newImageFiles: ImageFile[] = filesToAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setImageFiles((prev) => [...prev, ...newImageFiles]);

      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleRemoveImage = (indexToRemove: number) => {
      setImageFiles((prev) => {
        const imageToRemove = prev[indexToRemove];
        // Revoke ObjectURL before removing
        if (imageToRemove?.preview) {
          URL.revokeObjectURL(imageToRemove.preview);
        }
        return prev.filter((_, index) => index !== indexToRemove);
      });
    };

    // Convert File to base64
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    // Get current data (text, images base64, audio base64, audioString)
    const getCurrentData = async (): Promise<ChatInputData> => {
      const imageBase64s = await Promise.all(
        imageFiles.map((imageFile) => fileToBase64(imageFile.file)),
      );

      return {
        text: inputValue,
        images: imageBase64s,
        audio: audioBase64,
        audioString: recordedTranscript || null,
      };
    };

    // Handle send action
    const handleSend = async () => {
      if (onSendMessage) {
        const data = await getCurrentData();
        onSendMessage(data);
      }
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    // Call onDataChange when text, images, audio, or audioString changes
    useEffect(() => {
      if (!onDataChange) return;

      const updateData = async () => {
        // Convert images to base64
        const imageBase64s = await Promise.all(
          imageFiles.map((imageFile) => fileToBase64(imageFile.file)),
        );

        const data: ChatInputData = {
          text: inputValue,
          images: imageBase64s,
          audio: audioBase64,
          audioString: recordedTranscript || null,
        };
        console.log('data:', data);

        onDataChange(data);
      };

      updateData();
    }, [inputValue, imageFiles, audioBase64, recordedTranscript, onDataChange]);

    // Cleanup ObjectURLs on unmount
    useEffect(() => {
      return () => {
        imageFiles.forEach((imageFile) => {
          URL.revokeObjectURL(imageFile.preview);
        });
      };
    }, [imageFiles]);

    // Cleanup MediaRecorder on unmount
    useEffect(() => {
      return () => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== 'inactive'
        ) {
          mediaRecorderRef.current.stop();
        }
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }, []);

    return (
      <div className="flex-1 flex flex-col items-center">
        {(imageFiles.length > 0 || audioBase64) && (
          <div className="media-preview w-full py-2 items-start flex gap-2 flex-wrap">
            {imageFiles.map((imageFile, index) => (
              <div key={index} className="relative">
                <img
                  src={imageFile.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-[60px] h-[60px] rounded-md object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-500 hover:bg-destructive/90 p-0"
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                >
                  <X className="size-3 text-white" />
                </Button>
              </div>
            ))}
            {audioBase64 && (
              <AudioPlayer
                hasBg={true}
                src={audioBase64}
                onRemove={() => {
                  setAudioBase64(null);
                  setRecordedTranscript('');
                }}
              />
            )}
          </div>
        )}
        <div className="relative gap-2 flex w-full items-center">
          {/* Upload button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8"
            onClick={handleImageUpload}
            disabled={isRecording || audioBase64 !== null}
            type="button"
          >
            <ImageUp
              className={`size-4 ${
                isRecording || audioBase64 !== null
                  ? 'text-gray-300'
                  : 'text-[#9299a5]'
              }`}
            />
          </Button>
          <div className="relative flex items-center flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            {!isRecording ? (
              <Input
                value={inputValue}
                onChange={onInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Pour your heart out here ..."
                className={`h-12! pl-8 relative z-10 w-full rounded-full text-sm border-0 bg-[#f9f8fa] backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  isSupported ? 'pr-12' : ''
                }`}
              />
            ) : (
              <div
                className={`relative z-10 w-full rounded-full border-0 bg-[#f9f8fa] h-12 flex items-center px-4 ${
                  isSupported ? 'pr-12' : ''
                }`}
              >
                <span className="text-sm pl-4 text-muted-foreground">
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
                disabled={imageFiles.length > 0}
                type="button"
              >
                {isRecording ? (
                  <Square className="size-4 text-destructive" />
                ) : (
                  <Mic
                    className={`size-4 ${
                      imageFiles.length > 0
                        ? 'text-gray-300'
                        : 'text-muted-foreground'
                    }`}
                  />
                )}
              </Button>
            )}
          </div>
          <div className="relative gap-2 flex items-center">
            <Button
              onClick={handleSend}
              disabled={disabled}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12! px-6 shrink-0"
            >
              <Send className="size-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
