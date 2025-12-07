import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { getMessagesQueryKey } from "vul-super-app/hooks/conversations/use-get-messages";
import {
  TGetMessagesByConversationId,
  TMessageTemp,
} from "vul-super-app/domain/models/conversation";

export const updateMessagesQuery = (
  oldData: InfiniteData<TGetMessagesByConversationId, unknown> | undefined,
  messages: TMessageTemp[]
) => {
  const firstPage = oldData?.pages[0];
  const reversedArr = [...messages].reverse();

  if (firstPage) {
    return {
      ...oldData,
      pages: [
        {
          ...firstPage,
          data: reversedArr,
        },
      ],
    };
  }

  return {
    pages: [
      {
        next_id: "",
        data: reversedArr,
      },
    ],
    pageParams: [0],
  };
};

export const updateCacheMessagesInConversation = (
  queryClient: QueryClient,
  conversationId: string,
  messages: TMessageTemp[]
) => {
  const key = getMessagesQueryKey(conversationId);
  queryClient.setQueryData<InfiniteData<TGetMessagesByConversationId>>(key, (oldData) =>
    updateMessagesQuery(oldData, messages)
  );
};
