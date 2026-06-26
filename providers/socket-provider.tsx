"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useChatStore } from "@/store/chat";
import { useMe } from "@/hooks/auth";
import { axiosInstance } from "@/lib/axios-instance";
import { ChatResponse } from "@/types/chat";
import { Message } from "@/types/message";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { activeChat, setTyping } = useChatStore();
  const { data: me } = useMe();
  const activeChatRef = useRef(activeChat);

  // Keep a ref of activeChat so that we don't have to rebind socket events constantly
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const typingTimers: Record<string, NodeJS.Timeout> = {};

    socket.on("message:new", (msg: Message & { chatId: string }) => {
      const chatId = msg.chatId;

      // 1. Update message room if cached
      queryClient.setQueryData(["chat-messages", chatId], (old: any[] = []) => {
        const filtered = old.filter((m) => !m.id.startsWith("temp-"));
        if (filtered.some((m) => m.id === msg.id)) return filtered;
        return [...filtered, msg];
      });

      // 2. Update recent chats preview and unread counts
      queryClient.setQueryData<ChatResponse[]>(["chats"], (old = []) => {
        const chatIndex = old.findIndex((c) => c.chatId === chatId);
        if (chatIndex === -1) {
          queryClient.invalidateQueries({ queryKey: ["chats"] });
          return old;
        }

        const isCurrentActive = activeChatRef.current?.chatId === chatId;
        const currentUnread = old[chatIndex].unreadCount || 0;

        const updatedChat = {
          ...old[chatIndex],
          lastMessage: msg,
          updatedAt: msg.createdAt,
          unreadCount: isCurrentActive ? 0 : currentUnread + 1,
        };

        const newChats = [...old];
        newChats.splice(chatIndex, 1);
        return [updatedChat, ...newChats];
      });

      // 3. Mark as read immediately if it's the active chat and not from me
      if (activeChatRef.current?.chatId === chatId && msg.userId !== me?.id) {
        axiosInstance.post(`/chats/${chatId}/read`).catch(console.error);
      }
    });

    socket.on("typing", ({ chatId }: { chatId: string }) => {
      setTyping(chatId, true);

      if (typingTimers[chatId]) clearTimeout(typingTimers[chatId]);
      typingTimers[chatId] = setTimeout(() => {
        setTyping(chatId, false);
      }, 2000);
    });

    socket.on("message:read", ({ chatId: readChatId }) => {
      queryClient.setQueryData(["chat-messages", readChatId], (old: any[] = []) =>
        old.map((m) =>
          m.userId === me?.id && !m.readAt
            ? { ...m, readAt: new Date().toISOString() }
            : m
        )
      );
    });

    return () => {
      socket.off("message:new");
      socket.off("typing");
      socket.off("message:read");
      Object.values(typingTimers).forEach(clearTimeout);
      socket.disconnect();
    };
  }, [me?.id, queryClient, setTyping]);

  return <>{children}</>;
}
