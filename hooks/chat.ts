import { axiosInstance } from "@/lib/axios-instance";
import { ChatResponse } from "@/types/chat";
import { Message } from "@/types/message";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type SendMessageInput = {
  chatId: string;
  content: string;
};

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ChatResponse[]>("/chats");
      return data;
    },
  });
}

export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Message[]>(
        `/chats/${chatId}/messages`
      );
      return data;
    },
    enabled: !!chatId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<
    Message, // response type
    Error, // error type
    SendMessageInput, // variables type
    { previous: Message[] } // context type
  >({
    mutationFn: async ({ chatId, content }) => {
      const { data } = await axiosInstance.post<Message>("/messages", {
        chatId,
        content,
      });
      return data;
    },

    onMutate: async ({ chatId, content }) => {
      await queryClient.cancelQueries({
        queryKey: ["chat-messages", chatId],
      });

      const previous =
        queryClient.getQueryData<Message[]>(["chat-messages", chatId]) || [];

      const optimisticMessage: Message & {
        optimistic: true;
      } = {
        id: `temp-${Date.now()}`,
        content,
        userId: "me",
        createdAt: new Date().toISOString(),
        optimistic: true,
        readAt: null,
      };

      queryClient.setQueryData<Message[]>(
        ["chat-messages", chatId],
        [...previous, optimisticMessage]
      );

      return { previous };
    },

    onError: (_error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["chat-messages", variables.chatId],
          context.previous
        );
      }
    },
  });
}

export function useStartChat() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await axiosInstance.post<ChatResponse>("/chats", {
        userId,
      });
      return data;
    },
  });
}
