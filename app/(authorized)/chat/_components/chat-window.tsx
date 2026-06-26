"use client";

import { useEffect, useRef, useState } from "react";
import { Send, ChevronLeft, Check, CheckCheck, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { useMe } from "@/hooks/auth";
import { useChatMessages, useSendMessage } from "@/hooks/chat";
import { getSocket } from "@/lib/socket";
import { User } from "@/types/user";
import { axiosInstance } from "@/lib/axios-instance";
import { useChatStore } from "@/store/chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatResponse } from "@/types/chat";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: string) {
  return new Date(date).toDateString();
}

export function ChatWindow({
  activeChat,
}: {
  activeChat: { chatId: string; user: User };
}) {
  const { chatId, user } = activeChat;

  const { data: messages = [], isLoading } = useChatMessages(chatId);
  const sendMessage = useSendMessage();
  const { data: me } = useMe();

  const socket = getSocket();
  const queryClient = useQueryClient();
  const { setActiveChat } = useChatStore();

  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const { typingChats } = useChatStore();
  const typing = typingChats[chatId];
 
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastTypedRef = useRef<number>(0);

  /* ==============================
     Auto scroll to bottom
  ============================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ==============================
     Socket events
  ============================== */
  useEffect(() => {
    if (!chatId) return;

    socket.emit("join", chatId);

    socket.on("presence:sync", ({ chatId: syncChatId, onlineUserIds }) => {
      if (syncChatId !== chatId) return;
      const otherUserOnline = onlineUserIds.includes(user.id);
      setIsOnline(otherUserOnline);
    });

    socket.on("user:online", ({ userId: onlineUserId, chatId: onlineChatId }) => {
      if (onlineChatId !== chatId) return;
      if (onlineUserId === user.id) {
        setIsOnline(true);
      }
    });

    socket.on("user:offline", ({ userId: offlineUserId, chatId: offlineChatId }) => {
      if (offlineChatId !== chatId) return;
      if (offlineUserId === user.id) {
        setIsOnline(false);
      }
    });

    return () => {
      socket.emit("leave", chatId);
      socket.off("presence:sync");
      socket.off("user:online");
      socket.off("user:offline");
    };
  }, [chatId, user.id]);

  /* ==============================
     Mark messages as read on open
  ============================== */
  useEffect(() => {
    if (!chatId) return;
    axiosInstance.post(`/chats/${chatId}/read`).catch(console.error);

    queryClient.setQueryData<ChatResponse[]>(["chats"], (old = []) =>
      old.map((c) => (c.chatId === chatId ? { ...c, unreadCount: 0 } : c))
    );
  }, [chatId, queryClient]);

  /* ==============================
     Send message
  ============================== */
  async function handleSend() {
    if (!message.trim() || sendMessage.isPending) return;

    const content = message.trim();
    setMessage(""); // clear input immediately to prevent double submissions

    try {
      await sendMessage.mutateAsync({
        chatId,
        content,
      });
    } catch (err) {
      setMessage(content); // restore input if sending fails
      console.error(err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading conversation…
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col min-h-0">
      {/* ================= Header ================= */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -ml-2 md:hidden"
            onClick={() => setActiveChat(null)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background",
                isOnline ? "bg-green-500" : "bg-muted-foreground/40"
              )}
            />
          </div>

          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hidden md:flex text-muted-foreground hover:text-foreground"
          onClick={() => setActiveChat(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* ================= Typing indicator ================= */}
      {typing && (
        <div className="px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex gap-1 items-center bg-muted rounded-full px-3 py-1.5 shadow-sm">
            <span className="font-medium mr-1">{user.firstName} is typing</span>
            <span className="flex gap-0.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
            </span>
          </div>
        </div>
      )}

      {/* ================= Messages ================= */}
      <ScrollArea className="flex-1 px-4 py-4 min-h-0">
        <div className="space-y-4">
          {messages.map((msg, index) => {
            const isMine = msg.userId === me?.id;
            const prev = messages[index - 1];

            const showDate =
              !prev || formatDate(prev.createdAt) !== formatDate(msg.createdAt);

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="my-4 text-center text-xs text-muted-foreground">
                    {formatDate(msg.createdAt)}
                  </div>
                )}

                <div
                  className={cn(
                    "flex",
                    isMine ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-xl px-4 py-2 text-sm",
                      isMine ? "bg-amber-500 text-black" : "bg-muted"
                    )}
                  >
                    <p>{msg.content}</p>

                    <p className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                      {formatTime(msg.createdAt)}
                      {isMine && (
                        <span className="inline-block ml-0.5">
                          {msg.readAt ? (
                            <CheckCheck className="h-3.5 w-3.5 text-blue-900" />
                          ) : (
                            <Check className="h-3.5 w-3.5 text-black/50" />
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {!messages.length && (
            <div className="text-center text-sm text-muted-foreground">
              No messages yet. Say hello 👋
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* ================= Input ================= */}
      <div className="border-t p-4 flex gap-2">
        <Input
          placeholder="Type a message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);

            const now = Date.now();
            if (now - lastTypedRef.current > 800) {
              socket.emit("typing", { chatId });
              lastTypedRef.current = now;
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={sendMessage.isPending}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
