'use client';

import { TASK_TYPE } from '@/constants/task';
import { useCommonCompute } from '@/hooks/use-compute';
import { useComputeGet } from '@/hooks/use-compute-get';
import { useSession } from '@/libs/better-auth/client';
import { createTaskParams } from '@/utils/helpers';
import { useState } from 'react';
import { Heart, Home, LoaderCircle, MicIcon, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/commons/page-header';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
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
import InteractiveModal from '@/features/chat/interactive-modal/interactive-modal';
import { toast } from 'sonner';

const ScrollToBottom = dynamic(() => import('react-scroll-to-bottom'), {
  ssr: false,
});

const MESSAGE_ROLE = {
  ASSISTANT: 'assistant',
  USER: 'user',
};

interface Message {
  id: string;
  content: string;
  role: (typeof MESSAGE_ROLE)[keyof typeof MESSAGE_ROLE];
  timestamp: Date;
}

interface TSendMessageOptions {
  content?: string;
  isResend: boolean;
}

export default function PartnerChatPage() {
  const { data: session } = useSession();
  const [openInteractiveModal, setOpenInteractiveModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const partnerId = params.id;
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [lastestMessage, setLastestMessage] = useState<Message>();

  const mutateChat = useCommonCompute();
  const userId = session?.user.id;
  const enabled = Boolean(userId) && Boolean(partnerId);
  const { data, isLoading } = useComputeGet(
    createTaskParams(TASK_TYPE.RELATIONSHIP_CHAT_HISTORY, {
      user_id: userId || '',
      partner_id: partnerId || '',
      include_archived: false,
    }),
    {
      enabled,
      queryKeys: [partnerId],
    }
  );
  const { data: partnerData, isLoading: isLoadingPartnerData } = useComputeGet(
    createTaskParams(TASK_TYPE.PARTNER_PROFILE_GET, {
      user_id: userId || '',
      partner_id: partnerId || '',
    }),
    {
      enabled,
      queryKeys: [partnerId],
    }
  );

  const existingVoice = partnerData?.result?.partner_voice;

  // const bb = queryClient.getQueriesData({
  //   queryKey: ['compute', TASK_TYPE.RELATIONSHIP_CHAT_HISTORY, partnerId],
  // });
  // console.log('bb:', bb);
  // const [, aa] = bb;
  // console.log('queryData:', aa);

  function setNewMessageState(
    queryKey: string[],
    newMessage: Message,
    options?: TSendMessageOptions
  ) {
    const { isResend = false } = options || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [queryResult] = queryClient.getQueriesData<any>({
      queryKey: queryKey,
    });
    const [, queryData] = queryResult;
    const currentMessages = queryData?.result?.messages;
    const newMessages = [
      ...currentMessages,
      ...(!isResend ? [newMessage] : []),
    ];
    const newQueryData = {
      ...queryData,
      result: {
        ...queryData.result,
        messages: newMessages,
      },
    };
    queryClient.setQueryData(
      ['compute', TASK_TYPE.RELATIONSHIP_CHAT_HISTORY, partnerId],
      newQueryData
    );
  }

  const handleSend = async (
    _userId: string,
    _partnerId: string,
    options?: TSendMessageOptions
  ) => {
    const { content: messageContent } = options || {};
    const queryKey = [
      'compute',
      TASK_TYPE.RELATIONSHIP_CHAT_HISTORY,
      partnerId,
    ];
    const userMessage = inputValue.trim() || messageContent || '';
    const newMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: MESSAGE_ROLE.USER,
      timestamp: new Date(),
    };
    setInputValue('');
    try {
      if (userMessage) {
        setLastestMessage(newMessage);
        const inputArgs = {
          user_id: _userId,
          partner_id: _partnerId,
          user_message: userMessage,
        };
        const payload: TCommonPayload = {
          task_type: TASK_TYPE.RELATIONSHIP_CHAT,
          input_args: inputArgs,
          priority: 'high',
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setNewMessageState(queryKey, newMessage);
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
      setNewMessageState(queryKey, newMessage, { isResend: true });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!userId || !partnerId) return;
      if (isError) return;
      handleSend(userId, partnerId);
    }
  };

  const onSendMessage = () => {
    if (!userId || !partnerId) return;
    handleSend(userId, partnerId);
    // Close interactive modal when sending message
    if (openInteractiveModal) {
      setOpenInteractiveModal(false);
    }
  };

  const onResendMessage = () => {
    if (!userId || !partnerId || !lastestMessage) return;
    handleSend(userId, partnerId, {
      content: lastestMessage?.content,
      isResend: true,
    });
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
        <div className="absolute inset-0 bg-[#FFF0F2] -z-10" />

        {/* Header */}
        <div className="bg-transparent z-10 relative">
          <PageHeader
            title="Strategy for a successful crush"
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
        <div className="flex flex-col items-center bg-[#FFF9F9] pt-6 pb-4 px-4 z-10">
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
              <p className="text-sm text-[#FF8A9B] mb-4 text-center px-4">
                You're talking to {partnerName}, based on how she usually thinks
                and responds
              </p>
            </>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 overflow-hidden px-2">
          {!isLoading && !hasMessages && !isLoadingPartnerData && (
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
              scrollViewClassName="flex flex-col gap-4 px-4 py-4"
              followButtonClassName="scroll-to-bottom-button"
            >
              <p className="text-sm text-center font-medium text-[#FFB6C1] uppercase tracking-wide">
                SAFE SPACE
              </p>
              <div className="flex flex-col gap-4">
                {hasMessages &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  messageList.map((message: any, index: number) => {
                    const isAssistant = message.role === 'assistant';
                    const messageContent = message.content;
                    const isLastMessage = index === messageList.length - 1;
                    const isUserTyping =
                      isLastMessage && !isAssistant && inputValue.trim() === '';

                    const nextMessage = messageList[index + 1];
                    const nextIsAssistant = nextMessage?.role === 'assistant';

                    return (
                      <div
                        key={message.id || message.timestamp || index}
                        className="flex flex-col"
                      >
                        {/* Assistant Message */}
                        {isAssistant && (
                          <div className="flex flex-col items-start">
                            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white text-foreground ">
                              <p className="text-sm leading-relaxed text-black">
                                {messageContent}
                              </p>
                            </div>
                            {/* Show "YOU (TYPED)" label after assistant message if next message is from user or if this is the last message */}
                            {(!nextMessage || !nextIsAssistant) && (
                              <span className="text-xs text-[#FFB6C1] mt-1.5 ml-1 uppercase font-medium">
                                {partnerName.toUpperCase()}
                              </span>
                            )}
                          </div>
                        )}

                        {/* User Message */}
                        {!isAssistant && (
                          <div className="flex flex-col items-end">
                            <div className="max-w-[85%] rounded-2xl px-4 py-3 shadow-sm bg-[#FFE5E9] text-foreground">
                              <p className="text-sm leading-relaxed text-black">
                                {messageContent}
                              </p>
                            </div>
                            {/* Show partner name label after user message if next message is from assistant or if this is the last message */}
                            {(!nextMessage || nextIsAssistant) && (
                              <span className="text-xs text-[#FFB6C1] mt-1.5 ml-1 uppercase font-medium">
                                YOU (TYPED)
                              </span>
                            )}
                            {/* Encouraging text after user message */}
                            {isLastMessage && (
                              <p className="text-xs text-gray-700 italic mt-3 text-center w-full">
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
                  <p className="text-xs text-gray-700 italic text-center mt-4">
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
        <div className="px-4 pb-4 pt-2 bg-[#FFF9F9] z-10">
          <div className="flex items-center gap-2">
            <ChatInput
              inputValue={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={() => {
                onSendMessage();
              }}
              disabled={!inputValue.trim() || isError}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 !h-12 px-6 shrink-0"
            >
              <Send className="size-4" />
              Send
            </Button>
          </div>
        </div>
        {/* Practice */}
        <div className="px-4 bg-[#FFF9F9]">
          <Button
            className="bg-[#e05e68] h-14! w-full rounded-3xl"
            onClick={() => {
              // if (!existingVoice) {
              //   toast.warning('Voice not found');
              //   return;
              // }
              setOpenInteractiveModal(true);
              setOpenPopover(false);
            }}
          >
            <MicIcon className="size-4 text-white" /> Practice with me
          </Button>
        </div>
      </div>
      {openInteractiveModal && (
        <InteractiveModal
          open={openInteractiveModal}
          onClose={() => {
            setOpenInteractiveModal(false);
          }}
          partnerName={partnerName}
          partnerAvatar={partnerAvatar}
          partnerGender={partnerGender}
        />
      )}
    </>
  );
}
