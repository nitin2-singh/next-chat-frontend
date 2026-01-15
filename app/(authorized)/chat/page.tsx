"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchResults } from "./_components/SearchResult";
import { RecentChats } from "./_components/RecentChat";
import { ChatWindow } from "./_components/chat-window";
import { User } from "@/types/user";

function EmptyChatState() {
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground">
      Select a chat to start messaging
    </div>
  );
}

type ActiveChat = {
  chatId: string;
  user: User;
};

export default function DefaultChatPage() {
  const [search, setSearch] = useState("");
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 border-r bg-background flex flex-col">
        {/* Search */}
        <div className="p-4 border-b">
          <Input
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Search results */}
        {search && (
          <SearchResults
            search={search}
            onSelectChat={(chatId, user) => {
              setActiveChat({ chatId: chatId, user: user });

              setSearch(""); // close dropdown
            }}
          />
        )}

        {/* Recent chats */}
        <RecentChats
          onSelectChat={(chatId, user) => {
            setActiveChat({ chatId: chatId, user: user });
          }}
          activeChatId={activeChat?.chatId ?? ""}
        />
      </aside>

      {/* Right panel */}
      <main className="flex-1">
        {activeChat?.chatId ? (
          <ChatWindow activeChat={activeChat} />
        ) : (
          <EmptyChatState />
        )}
      </main>
    </div>
  );
}
