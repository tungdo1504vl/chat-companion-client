'use client';

import { TASK_TYPE } from '@/constants/task';
import { useComputeGet } from '@/hooks/use-compute-get';
import { useSession } from '@/libs/better-auth/client';
import { createTaskParams } from '@/utils/helpers';
import { useState, useRef } from 'react';
import { Home, MicIcon, StarsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/commons/page-header';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ASSISTANT_ROUTES } from '@/constants/routes';
import { LoadingSkeleton } from '@/components/commons/loading-skeleton';
import dynamic from 'next/dynamic';
import { ChatInput } from '@/components/commons/chat-input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import InteractiveModalDemo from '@/features/chat/interactive-modal-demo/interactive-modal-demo';
import { toast } from 'sonner';
import {
  ChatInputData,
  ChatInputRef,
} from '@/components/commons/chat-input/types';
import {
  formatAudioBase64,
  formatImageBase64,
  formatUserInput,
} from '@/utils/chat';
import { AudioPlayerUI } from '@/components/commons/audio-player-ui';
import { cn } from '@/libs/tailwind/utils';
import {
  FAKE_MESSAGE_LIST,
  FAKE_MESSAGE_RESPONSE,
} from '@/constants/fake-data';
import { InteractivePlayer } from '@/components/commons/interactive-player';
import { promiseHelper } from '@/utils/promise';
import { MOCK_PARTNER_PROFILE } from '@/stores/partner';
import Link from 'next/link';

const ScrollToBottom = dynamic(() => import('react-scroll-to-bottom'), {
  ssr: false,
});

const MESSAGE_ROLE = {
  ASSISTANT: 'assistant',
  USER: 'user',
};

interface Message {
  id?: string;
  content: string;
  role: (typeof MESSAGE_ROLE)[keyof typeof MESSAGE_ROLE];
  timestamp: string;
  data_base64?: string;
  mime_type?: string;
  questionType?: string;
  type?: string;
  isEvaluateMsg?: boolean;
  isInteractiveMsg?: boolean;
}

interface TSendMessageOptions {
  content?: string;
  isResend: boolean;
}

type PartnerChatPageClientProps = Readonly<{
  partnerId: string;
}>;

export default function PartnerChatPageClientDemoV2({
  partnerId,
}: PartnerChatPageClientProps) {
  const { data: session } = useSession();
  const [openInteractiveModal, setOpenInteractiveModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [messageDataList, setMessageDataList] =
    useState<Message[]>(FAKE_MESSAGE_LIST);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [round, setRound] = useState<number>(1); // Track round number (1 or 2)
  const chatInputRef = useRef<ChatInputRef>(null);

  const userId = session?.user.id;
  const enabled = Boolean(userId) && Boolean(partnerId);
  const { data: partnerData, isLoading: isLoadingPartnerData } = useComputeGet(
    createTaskParams(TASK_TYPE.PARTNER_PROFILE_GET, {
      user_id: userId || '',
      partner_id: partnerId || '',
    }),
    {
      enabled,
      queryKeys: [partnerId],
    },
  );

  const handleSendMessage = async (data: ChatInputData) => {
    if (!userId || !partnerId) return;
    if (isLoadingResponse) return;

    const { images, audio, audioString } = data || {};
    const existingImage = images && images.length > 0;
    const existingAudio = Boolean(audio);
    const userMessage = inputValue.trim() || audioString || '';

    if (!userMessage && !existingImage && !existingAudio) return;

    // Build user messages
    const newUserMessages: Message[] = [];

    // Add text message if exists
    if (userMessage) {
      newUserMessages.push({
        id: `user-${Date.now()}`,
        content: userMessage,
        role: MESSAGE_ROLE.USER,
        timestamp: new Date().toISOString(),
        type: 'text',
      });
    }

    // Add image messages if existingImage is true
    if (existingImage && images && images.length > 0) {
      images.forEach((image, index) => {
        newUserMessages.push({
          id: `image-${Date.now()}-${index}`,
          content: 'image attachment: image/png',
          role: MESSAGE_ROLE.USER,
          timestamp: new Date().toISOString(),
          data_base64: `${image}`,
          mime_type: 'image/png',
          type: 'image',
        });
      });
    }

    // Add audio message if existingAudio is true
    if (existingAudio && audio) {
      newUserMessages.push({
        id: `audio-${Date.now()}`,
        content: 'audio attachment: audio/wav',
        role: MESSAGE_ROLE.USER,
        timestamp: new Date().toISOString(),
        data_base64: audio,
        mime_type: 'audio/wav',
        type: 'audio',
      });
    }

    // Add user messages to the list
    setMessageDataList((prev) => [...prev, ...newUserMessages]);
    setInputValue('');
    chatInputRef.current?.resetImage();
    chatInputRef.current?.resetAudio();

    // Determine questionType for response
    let questionType = 'text';
    if (existingImage) {
      questionType = 'image';
    } else if (existingAudio) {
      questionType = 'audio';
    }

    // Find response from FAKE_MESSAGE_RESPONSE
    const response = FAKE_MESSAGE_RESPONSE.find(
      (msg) => msg.questionType === questionType,
    );

    if (response) {
      setIsLoadingResponse(true);
      // Fake delay
      await promiseHelper.delay(1500);

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response.content,
        role: MESSAGE_ROLE.ASSISTANT,
        timestamp: new Date().toISOString(),
        type: response.type || 'text',
        questionType: response.questionType,
      };

      setMessageDataList((prev) => [...prev, assistantMessage]);
      setIsLoadingResponse(false);
    }
  };

  const hasMessages = messageDataList?.length > 0;

  // Extract partner info
  const partnerProfile =
    partnerData?.result?.partner_profile || partnerData?.result;
  const partnerName = MOCK_PARTNER_PROFILE.name;
  const partnerAvatar = partnerProfile?.basic_info?.avatar_url;
  const partnerGender = partnerProfile?.basic_info?.gender;

  return (
    <>
      <div className="flex flex-col h-full relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-[#fef9f8] -z-10" />

        {/* Header */}
        <div className="bg-transparent z-10 relative">
          <PageHeader
            title=""
            onBackClick={() => {
              router.push(ASSISTANT_ROUTES.PARTNERS);
            }}
            onMenuClick={() => {
              setOpenPopover(true);
            }}
          />
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
              <div
                className="absolute top-3 right-3 w-9 h-9 opacity-0 pointer-events-none"
                aria-hidden="true"
              />
            </PopoverTrigger>
            <PopoverContent className="w-42 p-2" align="end">
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer w-full text-left"
                  onClick={() => {
                    router.push('/assistant');
                  }}
                >
                  <Home className="size-5" />
                  <span>Back to home</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Partner Info Section */}
        <div className="flex flex-col items-center pt-2 pb-2 px-4 z-10">
          {/* Partner Avatar */}
          <Link
            href={`/partners/${MOCK_PARTNER_PROFILE.id}`}
            className="relative w-12 h-12 mb-3"
          >
            <Image
              src={MOCK_PARTNER_PROFILE.avatarUrl || ''}
              alt={partnerName}
              fill
              className="object-cover rounded-full"
            />
          </Link>

          {/* Partner Name */}
          <h2 className="text-2xl font-semibold text-black mb-1">
            {partnerName}
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-400 font-normal mb-4 text-center px-4">
            Practice what you want to say to crush. I'm here to help you find
            the way to crush's heart
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 overflow-hidden px-2">
          {!hasMessages && !isLoadingPartnerData && (
            <div className="py-3 text-black/40 text-center">
              Enter message to start ...
            </div>
          )}
          {isLoadingPartnerData ? (
            <div className="h-full px-4 py-4">
              <LoadingSkeleton />
            </div>
          ) : (
            <ScrollToBottom
              className="h-full"
              scrollViewClassName="flex flex-col gap-4 px-1 py-4"
              followButtonClassName="scroll-to-bottom-button"
            >
              <p className="text-xs text-center font-semibold text-[#FFB6C1] uppercase tracking-wide">
                Your secret space
              </p>
              <div className="flex flex-col gap-4">
                {hasMessages &&
                  messageDataList.map((message: Message, index: number) => {
                    const isAssistant = message.role === 'assistant';
                    const messageContent = message.content;
                    const messageType = message.type;
                    const messageDataBase64 = message.data_base64;
                    const isLastMessage = index === messageDataList.length - 1;

                    const nextMessage = messageDataList[index + 1];
                    const nextIsAssistant = nextMessage?.role === 'assistant';
                    const isMediaMessage =
                      messageType === 'image' || messageType === 'audio';

                    return (
                      <div
                        key={`${message.id || message.timestamp}${index}`}
                        className="flex flex-col"
                      >
                        {/* Assistant Message */}
                        {isAssistant && (
                          <div className="flex flex-col items-start">
                            <div className="relative max-w-[85%] rounded-ss-xs rounded-se-2xl rounded-es-2xl rounded-ee-2xl px-4 py-3 bg-white text-foreground ">
                              {messageType === 'text' &&
                              message.isInteractiveMsg ? (
                                <InteractivePlayer />
                              ) : (
                                <p className="text-sm leading-relaxed text-black">
                                  {messageContent}
                                </p>
                              )}
                              {message.isEvaluateMsg && (
                                <span className="size-6 p-1 bg-yellow-400 rounded-full flex justify-center items center absolute left-0 -top-2">
                                  <StarsIcon className="size-4 text-white" />
                                </span>
                              )}
                            </div>
                            {/* Show "YOU (TYPED)" label after assistant message if next message is from user or if this is the last message */}
                            {(!nextMessage || !nextIsAssistant) && (
                              <span className="text-xs text-[#FFB6C1] mt-1.5 ml-1 uppercase font-medium">
                                {'ASSISTANT'}
                              </span>
                            )}
                          </div>
                        )}

                        {/* User Message */}
                        {!isAssistant && (
                          <div className="flex flex-col items-end">
                            <div
                              className={cn(
                                'max-w-[85%] rounded-ss-2xl rounded-se-xs px-4 py-3 shadow-sm bg-[#FFE5E9] text-foreground',
                                {
                                  'rounded-ss-lg rounded-es-lg rounded-ee-lg p-1!':
                                    isMediaMessage,
                                  'rounded-ss-2xl rounded-es-2xl rounded-ee-2xl':
                                    !isMediaMessage,
                                },
                              )}
                            >
                              {messageType === 'text' && (
                                <p className="text-sm leading-relaxed text-black px-2 py-2">
                                  {formatUserInput(messageContent)}
                                </p>
                              )}
                              {messageType === 'image' && messageDataBase64 && (
                                <div className="w-32 rounded-md overflow-hidden">
                                  <img
                                    alt="chat image"
                                    className="object-cover"
                                    src={formatImageBase64(messageDataBase64)}
                                  />
                                </div>
                              )}
                              {messageType === 'audio' && messageDataBase64 && (
                                <div className="w-1/2">
                                  <AudioPlayerUI
                                    hasBg={true}
                                    src={formatAudioBase64(messageDataBase64)}
                                  />
                                </div>
                              )}
                            </div>
                            {/* Show partner name label after user message if next message is from assistant or if this is the last message */}
                            {(!nextMessage || nextIsAssistant) && (
                              <span className="text-xs text-[#FFB6C1] mt-1.5 ml-1 uppercase font-medium">
                                YOU (TYPED)
                              </span>
                            )}
                            {/* Encouraging text after user message */}
                            {isLastMessage && (
                              <p className="text-xs text-gray-700  mt-3 text-center w-full">
                                You don't have to say it perfectly.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* Show encouraging text when no messages yet */}
                {!hasMessages && (
                  <p className="text-xs text-gray-700  text-center mt-4">
                    You don't have to say it perfectly.
                  </p>
                )}
              </div>
              {isLoadingResponse && (
                <div className="flex flex-col h-16 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                </div>
              )}
            </ScrollToBottom>
          )}
        </div>

        {/* Input Bar */}
        <div className="px-4 pb-4 pt-2 bg-white rounded-ss-2xl rounded-se-2xl z-10">
          <ChatInput
            ref={chatInputRef}
            inputValue={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)}
            onSendMessage={handleSendMessage}
            disabled={!inputValue.trim() || isLoadingResponse}
          />
        </div>
        {/* Practice */}
        <div className="px-4 bg-white">
          <Button
            className="bg-[#e05e68] h-14! w-full rounded-3xl"
            onClick={() => {
              setOpenInteractiveModal(true);
              setOpenPopover(false);
            }}
          >
            <MicIcon className="size-4 text-white" /> Practice with me
          </Button>
        </div>
      </div>
      {openInteractiveModal && (
        <InteractiveModalDemo
          open={openInteractiveModal}
          onClose={() => {
            setOpenInteractiveModal(false);
          }}
          partnerName={partnerName}
          partnerAvatar={partnerAvatar}
          partnerGender={partnerGender}
          round={round}
          onRoundChange={setRound}
          onAppendMessage={(messages) => {
            setIsLoadingResponse(true);
            setTimeout(() => {
              setMessageDataList((prev) => [...prev, ...messages]);
              setIsLoadingResponse(false);
            }, 1000);
          }}
        />
      )}
    </>
  );
}
