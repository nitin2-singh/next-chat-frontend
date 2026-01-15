"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
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

  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
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

    socket.on("message:new", (msg) => {
      queryClient.setQueryData(["chat-messages", chatId], (old: any[] = []) => {
        if (old.some((m) => m.id === msg.id)) return old;
        return [...old, msg];
      });
    });

    socket.on("typing", () => {
      setTyping(true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        setTyping(false);
      }, 1500);
    });

    socket.on("message:read", ({ chatId: readChatId }) => {
      if (readChatId !== chatId) return;

      queryClient.setQueryData(["chat-messages", chatId], (old: any[] = []) =>
        old.map((m) =>
          m.userId === me?.id && !m.readAt
            ? { ...m, readAt: new Date().toISOString() }
            : m
        )
      );
    });

    return () => {
      socket.emit("leave", chatId);
      socket.off("message:new");
      socket.off("typing");
      socket.off("message:read");
    };
  }, [chatId, me?.id]);

  /* ==============================
     Mark messages as read on open
  ============================== */
  useEffect(() => {
    if (!chatId) return;
    fetch(`/chats/${chatId}/read`, { method: "POST" });
  }, [chatId]);

  /* ==============================
     Send message
  ============================== */
  async function handleSend() {
    if (!message.trim()) return;

    await sendMessage.mutateAsync({
      chatId,
      content: message,
    });

    setMessage("");
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading conversation…
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* ================= Header ================= */}
      <div className="border-b px-4 py-3 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {user.firstName[0]}
            {user.lastName[0]}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      {/* ================= Typing indicator ================= */}
      {typing && (
        <div className="px-4 py-2 text-xs text-muted-foreground">
          {user.firstName} is typing…
        </div>
      )}

      {/* ================= Messages ================= */}
      <ScrollArea className="flex-1 px-4 py-4">
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
                      {isMine && <span>{msg.readAt ? "✓✓" : "✓"}</span>}
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
