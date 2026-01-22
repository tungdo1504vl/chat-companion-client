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
  StarIcon,
} from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { cn } from '@/libs/tailwind/utils';
import {
  FAKE_INTERACTIVE_DATA_ROUND_ONE,
  FAKE_INTERACTIVE_DATA_ROUND_TWO,
  FAKE_MESSAGE_LIST,
  FAKE_MESSAGE_RESPONSE,
} from '@/constants/fake-data';
import { promiseHelper } from '@/utils/promise';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const PARTNER_AVATAR_MEN = '/images/partner-men.png';
// const PARTNER_AVATAR_WOMEN = '/images/partner-women.jpeg';
const PARTNER_AVATAR_WOMEN =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDFBu7ihKfRsIjq6dEDQDkTqn4LzycaeVwJi-A8kD9EBRvazPeVl5o7enP19JsooIn6KBCFf-gl-JkhWnsJIfsQ1vb7ie0Jz2NOWaM_jCk9v15OTwILMkpv1yMyGNWoQ2mJIxRKZ9pzLAB32lk_5W15IJubeE7TcRxF2w1OrZLPJejDL_6KU3b_74wVpY8yoj2ejsuWIsNNDEYCwSF27MqvL_RjMapch817j9wSP9qmTFL5Sog3s2uXlxVubLske_JWd_TbNqcD8w';

interface Message {
  id?: string;
  content: string;
  role: 'assistant' | 'user';
  timestamp: string;
  data_base64?: string;
  mime_type?: string;
  questionType?: string;
  type?: string;
  isEvaluateMsg?: boolean;
  isInteractiveMsg?: boolean;
}

interface InteractiveModalProps {
  open: boolean;
  onClose?: () => void;
  partnerName?: string;
  partnerAvatar?: string;
  partnerGender?: string;
  round?: number;
  onRoundChange?: (round: number) => void;
  onAppendMessage?: (messages: Message[]) => void;
}

const InteractiveModalDemo: React.FC<InteractiveModalProps> = ({
  open,
  onClose,
  partnerName = 'Partner',
  partnerAvatar,
  partnerGender,
  round = 1,
  onRoundChange,
  onAppendMessage,
}) => {
  const [finalTranscript, setFinalTranscript] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [interactionIndex, setInteractionIndex] = useState(0);
  const [messageDataList, setMessageDataList] = useState<Message[]>(
    FAKE_MESSAGE_LIST as Message[],
  );
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const audioRef2 = React.useRef<HTMLAudioElement>(null);
  const micBtnRef = React.useRef<HTMLButtonElement>(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleInteractive = useCallback(
    async (text: string) => {
      setIsLoading(true);
      setAudioSrc(null);
      
      // Add user message to chat
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: text,
        role: 'user',
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      setMessageDataList((prev) => [...prev, userMessage]);

      try {
        // Simulate API delay
        await promiseHelper.delay(1000);

        // Determine questionType (for chat response)
        // Since this is voice interaction, we'll use 'audio' as questionType
        const questionType = 'audio';

        // Find response from FAKE_MESSAGE_RESPONSE
        const response = FAKE_MESSAGE_RESPONSE.find(
          (msg) => msg.questionType === questionType,
        );

        // Add assistant response to chat if found
        if (response) {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            content: response.content,
            role: 'assistant',
            timestamp: new Date().toISOString(),
            type: response.type || 'text',
            questionType: response.questionType,
          };
          setMessageDataList((prev) => [...prev, assistantMessage]);
        }

        // Use appropriate data based on round for audio
        const fakeDataArray =
          round === 1
            ? FAKE_INTERACTIVE_DATA_ROUND_ONE
            : FAKE_INTERACTIVE_DATA_ROUND_TWO;

        // Get audio from fake data based on current index
        const currentIndex = interactionIndex % fakeDataArray.length;
        const fakeData = fakeDataArray[currentIndex];

        if (fakeData?.data_base64) {
          // Use the audio path from fake data
          setAudioSrc(fakeData.data_base64);
        }

        // Increment index for next interaction
        setInteractionIndex((prev) => prev + 1);
      } finally {
        setIsLoading(false);
      }
    },
    [interactionIndex, round],
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

      // If round 1 ended (interactionIndex >= 5), append negative evaluation and move to round 2
      if (interactionIndex >= 5 && round === 1 && onAppendMessage) {
        const timestamp = new Date().toISOString();
        const negativeEvaluation: Message[] = [
          {
            id: `interactive-message-1-${timestamp}`,
            content: 'interactive',
            role: 'assistant',
            isInteractiveMsg: true,
            timestamp,
            type: 'text',
          },
          {
            id: `evaluation-negative-1-${timestamp}`,
            content:
              'Mình cùng nhìn lại nhé. Cuộc nói chuyện này fail ở khoảnh khắc bạn switch từ cảm xúc sang công việc.',
            role: 'assistant',
            isEvaluateMsg: true,
            timestamp,
            type: 'text',
          },
          {
            id: `evaluation-negative-2-${timestamp}`,
            content: 'Với Quyên:',
            role: 'assistant',
            isEvaluateMsg: true,
            timestamp,
            type: 'text',
          },
          {
            id: `evaluation-negative-3-${timestamp}`,
            content:
              'khi cô ấy vừa mở không gian để hiểu "bạn đang hỏi điều gì"• mà câu hỏi đó lại bị rút về mức an toàn → cô ấy sẽ cảm thấy bối rối và hơi hụt, Câu "bạn thấy mình thế nào?" mở ra một ngữ cảnh cảm xúc, nhưng việc chuyển sang "làm việc chung thấy sao?" khiến cô ấy không biết mình đang được hỏi với tư cách gì',
            role: 'assistant',
            isEvaluateMsg: true,
            timestamp,
            type: 'text',
          },
        ];
        console.log('negativeEvaluation:', negativeEvaluation);
        onAppendMessage(negativeEvaluation);
        // Move to round 2
        onRoundChange?.(2);
      }

      // If round 2 ended (interactionIndex >= 5), append positive evaluation
      if (interactionIndex >= 5 && round === 2 && onAppendMessage) {
        const timestamp = new Date().toISOString();
        const positiveEvaluation: Message[] = [
          {
            id: `interactive-message-1-${timestamp}`,
            content: 'interactive',
            role: 'assistant',
            isInteractiveMsg: true,
            timestamp,
            type: 'text',
          },
          {
            id: `evaluation-positive-${timestamp}`,
            content:
              'Bạn làm tốt ba điều rất quan trọng với Quyên: Bạn chọn không gian đúng Bạn nói rõ cảm xúc của bạn, cho thấy bạn thích Quyên ở điểm nào và cam kết mối quan hệ nghiêm túc Sau khi có sự xác nhận, hãy tiếp tục nói chuyện về các topics cả 2 cùng quan tâm và hãy kể với mình nghe những gì đã xảy ra sau buổi tỏ tình này. Rồi chúng ta cùng lên plan tiếp theo nhé!',
            role: 'assistant',
            isEvaluateMsg: true,
            timestamp,
            type: 'text',
          },
        ];
        onAppendMessage(positiveEvaluation);
      }

      // Reset interaction index
      setInteractionIndex(0);
    }
  }, [
    open,
    listening,
    resetTranscript,
    interactionIndex,
    round,
    onAppendMessage,
    onRoundChange,
  ]);

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
    setFinalTranscript(currentTranscript);
    handleInteractive(currentTranscript);
  };

  const handleMicClick = () => {
    if (listening) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleClose = () => {
    // Stop recording immediately when modal closes
    if (listening) {
      SpeechRecognition.stopListening();
    }
    // Call the original onClose callback
    onClose?.();
  };

  const handleOpenChange = (open: boolean) => {
    // Only stop recording if modal is being closed
    if (!open) {
      // Stop recording immediately when modal closes
      if (listening) {
        SpeechRecognition.stopListening();
      }
    }
    // Call the original onClose callback
    onClose?.();
  };

  const handleEvaluate = () => {
    // Stop recording if currently recording
    if (listening) {
      SpeechRecognition.stopListening();
    }

    // Create timestamp once to use for both id and timestamp
    const timestamp = new Date().toISOString();

    // Determine evaluation message based on round
    let evaluationMessages: Message[];
    if (round === 1) {
      evaluationMessages = [
        {
          id: `interactive-message-1-${timestamp}`,
          content: 'interactive',
          role: 'assistant',
          isInteractiveMsg: true,
          timestamp,
          type: 'text',
        },
        {
          id: `evaluation-negative-1-${timestamp}`,
          content:
            'Mình cùng nhìn lại nhé. Cuộc nói chuyện này fail ở khoảnh khắc bạn switch từ cảm xúc sang công việc.',
          role: 'assistant',
          isEvaluateMsg: true,
          timestamp,
          type: 'text',
        },
        {
          id: `evaluation-negative-2-${timestamp}`,
          content: 'Với Quyên:',
          role: 'assistant',
          isEvaluateMsg: true,
          timestamp,
          type: 'text',
        },
        {
          id: `evaluation-negative-3-${timestamp}`,
          content:
            'khi cô ấy vừa mở không gian để hiểu "bạn đang hỏi điều gì"• mà câu hỏi đó lại bị rút về mức an toàn → cô ấy sẽ cảm thấy bối rối và hơi hụt, Câu "bạn thấy mình thế nào?" mở ra một ngữ cảnh cảm xúc, nhưng việc chuyển sang "làm việc chung thấy sao?" khiến cô ấy không biết mình đang được hỏi với tư cách gì',
          role: 'assistant',
          isEvaluateMsg: true,
          timestamp,
          type: 'text',
        },
      ];
      // Move to round 2
      onRoundChange?.(2);
    } else {
      evaluationMessages = [
        {
          id: `interactive-message-1-${timestamp}`,
          content: 'interactive',
          role: 'assistant',
          isInteractiveMsg: true,
          timestamp,
          type: 'text',
        },
        {
          id: `evaluation-positive-${timestamp}`,
          content:
            'Bạn làm tốt ba điều rất quan trọng với Quyên: Bạn chọn không gian đúng Bạn nói rõ cảm xúc của bạn, cho thấy bạn thích Quyên ở điểm nào và cam kết mối quan hệ nghiêm túc Sau khi có sự xác nhận, hãy tiếp tục nói chuyện về các topics cả 2 cùng quan tâm và hãy kể với mình nghe những gì đã xảy ra sau buổi tỏ tình này. Rồi chúng ta cùng lên plan tiếp theo nhé!',
          role: 'assistant',
          isEvaluateMsg: true,
          timestamp,
          type: 'text',
        },
      ];
    }

    // Append evaluation message after a short delay to ensure modal is closed
    setTimeout(() => {
      onAppendMessage?.(evaluationMessages);
      onClose?.();
    }, 100);
  };

  function getMinInteractiveCount(_round: number) {
    if (_round === 1) return 1;
    return 2;
  }

  const partnerAvatarUrl = useMemo(() => {
    if (!partnerAvatar) {
      return partnerGender === 'Male'
        ? PARTNER_AVATAR_WOMEN
        : PARTNER_AVATAR_MEN;
    }
    return partnerAvatar;
  }, [partnerAvatar, partnerGender]);

  const subjectName = useMemo(() => {
    if (partnerGender === 'Male') return 'HE';
    return 'SHE';
  }, [partnerGender]);

  const objectName = useMemo(() => {
    if (partnerGender === 'Male') return 'her';
    return 'him';
  }, [partnerGender]);

  const microRingClass =
    'before:content-[""] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-20 before:h-20 before:rounded-full before:border-2 before:border-white/60 before:pointer-events-none before:z-0 after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-20 after:h-20 after:rounded-full after:border-2 after:border-white/60 after:pointer-events-none after:z-0';

  const partnerRingClass =
    'before:content-[""] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-64 before:h-64 before:rounded-full before:border-2 before:border-white/60 before:pointer-events-none before:z-0 after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-64 after:h-64 after:rounded-full after:border-2 after:border-white/60 after:pointer-events-none after:z-0';

  const isPartnerPlaying = isPlaying;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[100vw] border-none max-h-screen w-full h-full m-0 rounded-none p-6 flex flex-col"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Title</DialogTitle>
        </VisuallyHidden>
        {/* Background Gradient - Always brown */}
        <div
          className="absolute inset-0 z-0 transition-all duration-500"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, #5E3B32 0%, #261613 90%)',
          }}
        />
        {/* Audio */}
        <audio ref={audioRef2} src={'/full_demo.wav'} />
        {/* Top Section - Header with icon and prompt */}
        <div className="relative pt-8 px-6 z-10">
          {/* Speech bubble icon in top right */}
          <div className="absolute top-1 right-2 w-10 h-10 rounded-full bg-gray-200/30 flex items-center justify-center">
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <MessageSquare className="size-5 text-gray-100" />
            </button>
          </div>

          {/* Main prompt */}
          <div className="text-center mt-4">
            <h1 className="text-2xl font-sans font-bold text-white mb-3">
              Simulating {partnerName || 'Sarah'}'s reactions
            </h1>
            <p className="text-base font-sans  text-white/90">
              Based on her personality profile
            </p>
          </div>
        </div>

        {/* Middle Section - Partner Avatar */}
        <div className="flex-1 flex items-center justify-center px-6 pb-4 z-10">
          <div
            className="relative"
            onMouseEnter={() => setIsAvatarHovered(true)}
            onMouseLeave={() => setIsAvatarHovered(false)}
          >
            {/* Circular frame with gradient border */}
            <div
              className={cn(
                'partner-ring-wrapper relative w-64 h-64 rounded-full p-1 bg-[#503e39]',
                isPlaying && partnerRingClass,
              )}
            >
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                {partnerAvatarUrl ? (
                  <img
                    src={partnerAvatarUrl}
                    alt={partnerName}
                    className="object-cover rounded-full w-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-linear-to-br from-pink-200 to-pink-300 flex items-center justify-center text-6xl font-semibold text-pink-700">
                    {partnerName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Play/Pause overlay - only show when audioSrc exists and hovered */}
              {audioSrc && (
                <div
                  className={`absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-opacity duration-200 ${isAvatarHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <button
                    onClick={handlePlayAudio}
                    className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="size-8 text-[#5C4A3A]" fill="#5C4A3A" />
                    ) : (
                      <Play className="size-8 text-[#5C4A3A]" fill="#5C4A3A" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Bottom Section - Controls */}

        <div className="pb-9 px-6 z-10">
          {!browserSupportsSpeechRecognition ? (
            <div className="text-center">
              <p className="text-lg text-white font-semibold">
                Your browser does not support recording feature
              </p>
            </div>
          ) : (
            <>
              {/* Microphone/Stop Button */}
              <div className="flex flex-col items-center gap-2">
                {/* Status messages */}
                <div className="text-center min-h-6">
                  {isLoading && (
                    <p className="text-md font-semibold text-white animate-pulse">
                      Waiting for response...
                    </p>
                  )}
                </div>
                <div
                  className={cn(
                    'relative flex items-center justify-center w-32 h-32 microphone-ring-wrapper',
                    listening && microRingClass,
                  )}
                >
                  <Button
                    ref={micBtnRef}
                    onClick={handleMicClick}
                    className={cn(
                      'relative h-20 min-h-20! w-20 rounded-full shadow-lg transition-all active:scale-95 overflow-hidden z-10',
                      {
                        'bg-[#C9A882] hover:bg-[#B8956F]': listening,
                        'bg-[#D4B8A0] hover:bg-[#C9A882]': !listening,
                        'opacity-50 cursor-not-allowed':
                          !browserSupportsSpeechRecognition || isLoading,
                        'cursor-pointer': !(
                          !browserSupportsSpeechRecognition || isLoading
                        ),
                      },
                    )}
                    disabled={
                      !browserSupportsSpeechRecognition ||
                      isLoading ||
                      isPartnerPlaying
                    }
                  >
                    <Mic className="size-8 text-[#5C4A3A]" />
                  </Button>
                </div>

                {/* Instruction text - hide when loading */}
                <div className="min-h-4">
                  {!isLoading && (
                    <p className="text-xs uppercase text-white font-medium tracking-wider">
                      {listening
                        ? `RECORDING... CLICK TO STOP.`
                        : `CLICK TO SPEAK. SHE'S LISTENING.`}
                    </p>
                  )}
                </div>

                {/* Control icons */}
                <div className="flex items-center gap-4 mt-2">
                  {/* Speaker/Volume icon */}
                  {audioSrc && (
                    <button
                      onClick={handlePlayAudio}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Play audio"
                    >
                      <Volume2 className="size-5 text-gray-300" />
                    </button>
                  )}

                  {/* Stop icon */}
                  {listening && (
                    <button
                      onClick={handleStopRecording}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Close"
                      disabled={isLoading || isPartnerPlaying}
                    >
                      <Square className="size-5 text-gray-300" />
                    </button>
                  )}

                  {/* Refresh/Redo icon - disabled when loading */}
                  <button
                    onClick={() => {
                      // Stop recording if currently recording
                      if (listening) {
                        SpeechRecognition.stopListening();
                      }
                      // Reset all transcript states
                      resetTranscript();
                      setFinalTranscript('');
                      // Reset audio states
                      setAudioSrc(null);
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                      }
                      setIsPlaying(false);
                      // Reset loading state
                      setIsLoading(false);
                      // Reset interaction index
                      setInteractionIndex(0);
                    }}
                    disabled={isLoading || isPartnerPlaying}
                    className={`p-2 rounded-full transition-colors ${isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-white/20 cursor-pointer'
                      }`}
                    aria-label="Reset"
                  >
                    <RotateCcw className="size-5 text-gray-300" />
                  </button>

                  {/* Close icon */}
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Close"
                    disabled={isLoading || isPartnerPlaying}
                  >
                    <X className="size-5 text-gray-300" />
                  </button>

                  {/* Evaluate conversation - only show when interactionIndex > 1 */}
                  {interactionIndex > getMinInteractiveCount(round) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={cn(
                            'inline-flex items-center justify-center text-primary cursor-help',
                          )}
                        >
                          <button
                            onClick={handleEvaluate}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                            aria-label="Evaluate conversation"
                            disabled={isLoading || isPartnerPlaying}
                          >
                            <StarIcon className="size-5 text-gray-300" />
                          </button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Evaluate conversation</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* Hidden audio element */}
              {audioSrc && <audio ref={audioRef} src={audioSrc} />}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveModalDemo;
