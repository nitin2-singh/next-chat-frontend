import { axiosInstance } from "@/lib/axios-instance";
import { ChatResponse } from "@/types/chat";
import { Message } from "@/types/message";
import { User } from "@/types/user";
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

      const me = queryClient.getQueryData<User>(["me"]);
      const myId = me?.id || "me";

      const optimisticMessage: Message & {
        optimistic: true;
      } = {
        id: `temp-${Date.now()}`,
        content,
        userId: myId,
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

    onSuccess: (newMessage, variables) => {
      const { chatId } = variables;

      // Update message list: remove temp messages and add real one
      queryClient.setQueryData<Message[]>(
        ["chat-messages", chatId],
        (old = []) => {
          const filtered = old.filter((m) => !m.id.startsWith("temp-"));
          if (filtered.some((m) => m.id === newMessage.id)) {
            return filtered;
          }
          return [...filtered, newMessage];
        }
      );

      // Update recent chats preview in real-time
      queryClient.setQueryData<ChatResponse[]>(["chats"], (old = []) => {
        const chatIndex = old.findIndex((c) => c.chatId === chatId);
        if (chatIndex === -1) {
          queryClient.invalidateQueries({ queryKey: ["chats"] });
          return old;
        }

        const updatedChat = {
          ...old[chatIndex],
          lastMessage: newMessage,
          updatedAt: newMessage.createdAt,
        };

        const newChats = [...old];
        newChats.splice(chatIndex, 1);
        return [updatedChat, ...newChats];
      });
    },

    onError: (_error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["chat-messages", variables.chatId],
          context.previous
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", variables.chatId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
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
