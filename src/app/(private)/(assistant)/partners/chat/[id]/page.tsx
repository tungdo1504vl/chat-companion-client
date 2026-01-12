'use client';

import { TASK_TYPE } from '@/constants/task';
import { useCommonCompute } from '@/hooks/use-compute';
import { useComputeGet } from '@/hooks/use-compute-get';
import { useSession } from '@/libs/better-auth/client';
import { createTaskParams } from '@/utils/helpers';
import { useState } from 'react';
import { Heart, Home, LoaderCircle, Send } from 'lucide-react';
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

  return (
    <>
      <div className="flex flex-col h-full relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-blue-100 to-pink-100 -z-10" />

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
                    //
                  }}
                >
                  <Home className="size-5" />
                  <span>Back to home</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer w-full text-left"
                  onClick={() => {
                    if (!existingVoice) {
                      toast.warning('Voice not found');
                      return;
                    }
                    setOpenInteractiveModal(true);
                    setOpenPopover(false);
                  }}
                >
                  <Heart className="size-5" />
                  <span>Interactive</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 overflow-hidden px-2">
          {!isLoading && !hasMessages && (
            <div className="py-3 text-black/40">Enter message to start ...</div>
          )}
          {isLoading ? (
            <div className="h-full px-4 py-4">
              <LoadingSkeleton />
            </div>
          ) : (
            <ScrollToBottom
              className="h-full"
              scrollViewClassName="flex flex-col gap-3 px-4 py-4"
              followButtonClassName="scroll-to-bottom-button"
            >
              <div className="flex flex-col gap-3">
                {hasMessages &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  messageList.map((message: any, index: number) => {
                    const isAssistant = message.role === 'assistant';
                    const showMascot = isAssistant;
                    const messageContent = message.content;
                    return (
                      <div
                        key={message.id || message.timestamp || index}
                        className={`flex items-start gap-3 ${
                          isAssistant ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        {isAssistant && (
                          <div className="flex items-start gap-2">
                            {showMascot && (
                              <div className="relative w-12 h-12 shrink-0">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 via-orange-400 to-green-500 animate-pulse blur-sm opacity-50" />
                                <Image
                                  src="/mascot/mascot-removebg-preview.png"
                                  alt="Aura"
                                  fill
                                  className="object-contain relative z-10"
                                />
                              </div>
                            )}
                            {!showMascot && <div className="w-12" />}
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                index === 0
                                  ? 'bg-purple-200 text-foreground'
                                  : 'bg-blue-200 text-foreground'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {messageContent}
                              </p>
                            </div>
                          </div>
                        )}

                        {!isAssistant && (
                          <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-gray-200 text-foreground">
                            <p className="text-sm leading-relaxed">
                              {messageContent}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
        <div className="px-4 pb-4 pt-2 bg-transparent z-10">
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
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 shrink-0"
            >
              <Send className="size-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
      {openInteractiveModal && (
        <InteractiveModal
          open={openInteractiveModal}
          onClose={() => {
            setOpenInteractiveModal(false);
          }}
        />
      )}
    </>
  );
}
