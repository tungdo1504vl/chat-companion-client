'use client';

import { TASK_TYPE } from '@/constants/task';
import { useComputeGet } from '@/hooks/use-compute-get';
import { useSession } from '@/libs/better-auth/client';
import { createTaskParams } from '@/utils/helpers';
import { useState, useEffect } from 'react';
import { Home, MicIcon, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/commons/page-header';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ASSISTANT_ROUTES } from '@/constants/routes';
import { LoadingSkeleton } from '@/components/commons/loading-skeleton';
import { useQueryClient } from '@/libs/react-query';
import dynamic from 'next/dynamic';
import { ChatInput } from '@/components/commons/chat-input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import InteractiveModal from '@/features/chat/interactive-modal/interactive-modal';
import { toast } from 'sonner';

async function delay<T>(millis: number): Promise<T> {
  return await new Promise((resolve) => setTimeout(resolve, millis));
}

// Predefined script for demo
const DEMO_SCRIPT = {
  userQuestions: [
    "Hey, I'm headed to meet her at the cafe in an hour to finally tell her how I feel. But man, I'm doing that thing where I overanalyze everything we've talked about lately.",
    "Like, last week when we were grabbing lunch, she spent a good twenty minutes looking through my portfolio from my Iceland trip. She didn't just swipe through; she asked about the specific lighting in every shot.",
    'Then she said something that\'s been stuck in my head. She pointed at a shot of a lonely trail and whispered, "I\'d love to see a place like this, but only if I had someone who knew when to stay quiet and just look at the view with me." And then she looked right at me and smiled.',
    "And today, when we were texting about her upcoming trip to Japan, she sent me a list of shrines she wants to visit, but ended it with: \"Actually, I'm kind of holding off on the best spots... I think I'm saving those for a 'next time' with you.\"",
    'Am I crazy? Or is she basically leaving the door wide open?',
  ],
  partnerAnswers: [
    `You aren't overthinking it; you're observing the "emotional breadcrumbs" she's leaving for you.

When someone talks about photography, they are talking about their perspective—how they see the world. By telling you she only wants to see those views with someone who understands the silence, she isn't talking about a travel partner; she's talking about emotional compatibility. She's saying you "see" things the way she does.`,
    `She isn't just being friendly. She is signaling safety, shared vision, and a deep desire for your presence in her future. She's waiting for you to walk through that door.`,
  ],
};

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

type PartnerChatPageClientProps = Readonly<{
  partnerId: string;
}>;

export default function PartnerChatPageClientDemo({
  partnerId,
}: PartnerChatPageClientProps) {
  const { data: session } = useSession();
  const [openInteractiveModal, setOpenInteractiveModal] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [lastestMessage, setLastestMessage] = useState<Message>();
  const [demoMessages, setDemoMessages] = useState<Message[]>([]);
  const [isDemoInitialized, setIsDemoInitialized] = useState(false);

  const userId = session?.user.id;
  const enabled = Boolean(userId) && Boolean(partnerId);
  const { data: partnerData, isLoading } = useComputeGet(
    createTaskParams(TASK_TYPE.PARTNER_PROFILE_GET, {
      user_id: userId || '',
      partner_id: partnerId || '',
    }),
    {
      enabled,
      queryKeys: [partnerId],
    }
  );

  const isLoadingPartnerData = false;

  const existingVoice = partnerData?.result?.partner_voice;

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
    const [, queryData] = queryResult || [];
    const currentMessages = queryData?.result?.messages || [];
    const newMessages = [
      ...currentMessages,
      ...(!isResend ? [newMessage] : []),
    ];
    const newQueryData = {
      ...queryData,
      result: {
        ...(queryData?.result || {}),
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
    // Disabled for demo - messages are hardcoded
    return;
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

  // Auto-display demo script messages
  useEffect(() => {
    if (isDemoInitialized || isLoadingPartnerData) return;

    const initializeDemo = async () => {
      setIsDemoInitialized(true);
      const queryKey = [
        'compute',
        TASK_TYPE.RELATIONSHIP_CHAT_HISTORY,
        partnerId,
      ];

      // Display all 5 user questions first
      for (let i = 0; i < DEMO_SCRIPT.userQuestions.length; i++) {
        const userMessage: Message = {
          id: `user-${i + 1}-${Date.now()}`,
          content: DEMO_SCRIPT.userQuestions[i],
          role: MESSAGE_ROLE.USER,
          timestamp: new Date(),
        };
        setDemoMessages((prev) => [...prev, userMessage]);
        setNewMessageState(queryKey, userMessage);

        // Delay between messages (1.5 seconds)
        if (i < DEMO_SCRIPT.userQuestions.length - 1) {
          await delay(1500);
        }
      }

      // Wait a bit before showing partner responses
      await delay(2000);

      // Display partner answers
      for (let i = 0; i < DEMO_SCRIPT.partnerAnswers.length; i++) {
        const partnerMessage: Message = {
          id: `partner-${i + 1}-${Date.now()}`,
          content: DEMO_SCRIPT.partnerAnswers[i],
          role: MESSAGE_ROLE.ASSISTANT,
          timestamp: new Date(),
        };
        setDemoMessages((prev) => [...prev, partnerMessage]);
        setNewMessageState(queryKey, partnerMessage);

        // Delay between partner messages (2 seconds)
        if (i < DEMO_SCRIPT.partnerAnswers.length - 1) {
          await delay(2000);
        }
      }
    };

    // Delay 3 seconds before starting
    const timeoutId = setTimeout(() => {
      initializeDemo();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingPartnerData, isDemoInitialized, partnerId]);

  // Use demo messages only
  const messageList = demoMessages;
  const hasMessages = messageList.length > 0;

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
        <div className="flex flex-col items-center bg-[#FFF9F9] pt-2 pb-2 px-4 z-10">
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
              <p className="text-[12px] text-[#FF8A9B] mb-4 text-center px-4">
                You're talking to {partnerName}, based on how she usually thinks
                and responds
              </p>
            </>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 overflow-hidden px-2">
          {!hasMessages && !isLoadingPartnerData && (
            <div className="py-3 text-black/40 text-center">
              Enter message to start ...
            </div>
          )}
          {isLoadingPartnerData ? null : (
            <ScrollToBottom
              className="h-full"
              scrollViewClassName="flex flex-col gap-4 px-4 py-4"
              followButtonClassName="scroll-to-bottom-button"
            >
              <p className="text-sm text-center font-medium text-[#FFB6C1] uppercase tracking-wide">
                Your secret space
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
                {!hasMessages && !isLoadingPartnerData && (
                  <p className="text-xs text-gray-700 italic text-center mt-4">
                    You don't have to say it perfectly.
                  </p>
                )}
              </div>
              {isError && lastestMessage && (
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

        {/* Input Bar - Disabled for demo */}
        <div className="px-4 pb-4 pt-2 bg-[#FFF9F9] z-10 opacity-50 pointer-events-none">
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
              disabled
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
