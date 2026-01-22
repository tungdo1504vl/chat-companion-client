'use client';

import { TASK_TYPE } from '@/constants/task';
import { useCommonCompute } from '@/hooks/use-compute';
import { useComputeGet } from '@/hooks/use-compute-get';
import { useSession } from '@/libs/better-auth/client';
import { createTaskParams } from '@/utils/helpers';
import { useState, useEffect, useRef } from 'react';
import { Home, LoaderCircle, MicIcon, StarsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/commons/page-header';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ASSISTANT_ROUTES } from '@/constants/routes';
import { TCommonPayload } from '@/types/common';
import { LoadingSkeleton } from '@/components/commons/loading-skeleton';
import { useQueryClient } from '@/libs/react-query';
import { MUTATE_STATUS } from '@/constants/constants';
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
  buildInputItems,
  formatAudioBase64,
  formatImageBase64,
  formatUserInput,
} from '@/utils/chat';
import { AudioPlayerUI } from '@/components/commons/audio-player-ui';
import { cn } from '@/libs/tailwind/utils';
import { FAKE_MESSAGE_LIST } from '@/constants/fake-data';
import { InteractivePlayer } from '@/components/commons/interactive-player';

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
  const [chatInputData, setChatInputData] = useState<ChatInputData>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [messageDataList, setMessageDataList] =
    useState<Message[]>(FAKE_MESSAGE_LIST);
  const [lastestMessage, setLastestMessage] = useState<Message>();
  const [round, setRound] = useState<number>(1); // Track round number (1 or 2)
  const chatInputRef = useRef<ChatInputRef>(null);

  const mutateChat = useCommonCompute();
  const userId = session?.user.id;
  const enabled = Boolean(userId) && Boolean(partnerId);
  const { data, isFetched, isLoading } = useComputeGet(
    createTaskParams(TASK_TYPE.RELATIONSHIP_CHAT_HISTORY, {
      user_id: userId || '',
      partner_id: partnerId || '',
      include_archived: false,
    }),
    {
      enabled,
      queryKeys: [partnerId],
    },
  );
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

  const existingVoice = partnerData?.result?.partner_voice;

  function setNewMessageState(
    queryKey: string[],
    messages: Message[],
    options?: TSendMessageOptions & {
      existingImage?: boolean;
      existingAudio?: boolean;
      images?: string[];
      audio?: string | null;
    },
  ) {
    const {
      isResend = false,
      existingImage,
      existingAudio,
      images,
      audio,
    } = options || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [queryResult] = queryClient.getQueriesData<any>({
      queryKey: queryKey,
    });
    const [, queryData] = queryResult;
    const currentMessages = queryData?.result?.messages || [];

    // Build message list based on existingImage and existingAudio
    const messageList: Message[] = [];

    // Only add messages if not resend
    if (!isResend) {
      // Add text messages first
      if (messages.length > 0) {
        messageList.push(...messages);
      }

      // Add image messages if existingImage is true
      if (existingImage && images && images.length > 0) {
        images.forEach((image, index) => {
          messageList.push({
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
        messageList.push({
          id: `audio-${Date.now()}`,
          content: 'audio attachment: audio/wav',
          role: MESSAGE_ROLE.USER,
          timestamp: new Date().toISOString(),
          data_base64: audio,
          mime_type: 'audio/wav',
          type: 'audio',
        });
      }
    }

    const newMessages = [...currentMessages, ...messageList];
    const newQueryData = {
      ...queryData,
      result: {
        ...queryData.result,
        messages: newMessages,
      },
    };
    queryClient.setQueryData(
      ['compute', TASK_TYPE.RELATIONSHIP_CHAT_HISTORY, partnerId],
      newQueryData,
    );
  }

  const handleSend = async (
    _userId: string,
    _partnerId: string,
    data: ChatInputData,
    options?: TSendMessageOptions,
  ) => {
    const { content: messageContent } = options || {};
    const { images, audio } = data || {};
    const existingImage = images.length > 0;
    const existingAudio = Boolean(audio);
    const queryKey = [
      'compute',
      TASK_TYPE.RELATIONSHIP_CHAT_HISTORY,
      partnerId,
    ];
    const userMessage = inputValue.trim() || messageContent || '';
    // TODO: format newMessage with images or audio if exits
    const newMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: MESSAGE_ROLE.USER,
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    setInputValue('');
    chatInputRef.current?.resetImage();
    chatInputRef.current?.resetAudio();
    try {
      if (userMessage) {
        setLastestMessage(newMessage);
        const chatInputData = buildInputItems(data);
        const inputArgs = {
          user_id: _userId,
          partner_id: _partnerId,
          usecase: 'crush_strategy',
          user_message: userMessage,
          input_items: chatInputData,
        };
        const payload: TCommonPayload = {
          task_type: TASK_TYPE.RELATIONSHIP_CHAT,
          input_args: inputArgs,
          priority: 'high',
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setNewMessageState(queryKey, [newMessage], {
          isResend: false,
          existingImage,
          existingAudio,
          images,
          audio,
        });
        const res = await mutateChat.mutateAsync(payload);

        setIsError(false);
        if (res.result) {
          queryClient.invalidateQueries({
            queryKey,
          });
        }
      }
    } catch (error) {
      setIsError(true);
      // handle error
      setNewMessageState(queryKey, [newMessage], {
        isResend: true,
        existingImage,
        existingAudio,
        images,
        audio,
      });
    }
  };

  const onResendMessage = () => {
    if (!userId || !partnerId || !lastestMessage || !chatInputData) return;
    handleSend(userId, partnerId, chatInputData);
  };

  const handleSendMessage = (data: ChatInputData) => {
    setChatInputData(data);
    const chatInputData = buildInputItems(data);
    // return;
    if (!userId || !partnerId) return;
    if (isError) return;
    handleSend(userId, partnerId, data);
  };

  const messageList = data?.result?.messages;
  const hasMessages = messageList?.length > 0;

  // Extract partner info
  const partnerProfile =
    partnerData?.result?.partner_profile || partnerData?.result;
  const partnerName = partnerProfile?.basic_info?.name || 'Partner';
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
          {!isLoadingPartnerData && (
            <>
              {/* Partner Avatar */}
              <div className="relative w-12 h-12 mb-3">
                {partnerAvatar ? (
                  <Image
                    src={partnerAvatar}
                    alt={partnerName}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-2xl font-semibold text-pink-700">
                    {partnerName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Partner Name */}
              <h2 className="text-2xl font-semibold text-black mb-1">
                {partnerName}
              </h2>

              {/* Subtitle */}
              <p className="text-sm text-gray-400 font-normal mb-4 text-center px-4">
                Practice what you want to say to crush. I'm here to help you
                find the way to crush's heart
              </p>
            </>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 overflow-hidden px-2">
          {!isLoading && isFetched && !hasMessages && !isLoadingPartnerData && (
            <div className="py-3 text-black/40 text-center">
              Enter message to start ...
            </div>
          )}
          {isLoading ? (
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  messageList.map((message: any, index: number) => {
                    const isAssistant = message.role === 'assistant';
                    const messageContent = message.content;
                    const messageType = message.type;
                    const messageDataBase64 = message.data_base64;
                    const isLastMessage = index === messageList.length - 1;
                    const isUserTyping =
                      isLastMessage && !isAssistant && inputValue.trim() === '';

                    const nextMessage = messageList[index + 1];
                    const nextIsAssistant = nextMessage?.role === 'assistant';
                    const isMediaMessage = messageType === 'image' || 'audio';

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
                                <p className="w-1/2">
                                  <AudioPlayerUI
                                    hasBg={true}
                                    src={formatAudioBase64(messageDataBase64)}
                                  />
                                </p>
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
                {!hasMessages && !isLoading && (
                  <p className="text-xs text-gray-700  text-center mt-4">
                    You don't have to say it perfectly.
                  </p>
                )}
              </div>
              {mutateChat.status === MUTATE_STATUS.PENDING && (
                <div className="flex flex-col h-16 items-center justify-center">
                  <LoaderCircle className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              )}
              {isError &&
                mutateChat.status !== MUTATE_STATUS.PENDING &&
                lastestMessage && (
                  <div className="flex flex-col gap-2 border rounded-2xl p-3">
                    <p className="text-red-400">Some thing when wrong!</p>
                    <Button
                      variant="outline"
                      className="w-max"
                      onClick={onResendMessage}
                    >
                      Try again
                    </Button>
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
            disabled={!inputValue.trim() || isError}
          />
        </div>
        {/* Practice */}
        <div className="px-4 bg-[#FFF9F9]">
          <Button
            className="bg-[#e05e68] h-14! w-full rounded-3xl"
            onClick={() => {
              if (!existingVoice) {
                toast.warning('Voice not found');
                return;
              }
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
            const queryKey = [
              'compute',
              TASK_TYPE.RELATIONSHIP_CHAT_HISTORY,
              partnerId,
            ];
            setNewMessageState(queryKey, messages, {
              isResend: false,
              existingImage: false,
              existingAudio: false,
            });
          }}
        />
      )}
    </>
  );
}
