"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchResults } from "./_components/SearchResult";
import { RecentChats } from "./_components/RecentChat";
import { ChatWindow } from "./_components/chat-window";
import { User } from "@/types/user";
import { useChatStore } from "@/store/chat";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
  const [searchFocused, setSearchFocused] = useState(false);
  const { activeChat, setActiveChat } = useChatStore();

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar - hidden on mobile if chat is active */}
      <aside className={cn(
        "border-r bg-background flex flex-col h-full shrink-0 w-full md:w-80 min-h-0",
        activeChat?.chatId ? "hidden md:flex" : "flex"
      )}>
        {/* Search & Sidebar Trigger */}
        <div className="p-4 border-b relative flex items-center gap-2">
          <SidebarTrigger className="shrink-0" />
          <Input
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />

          {/* Search results */}
          {(search || searchFocused) && (
            <div className="absolute top-[calc(100%+4px)] left-2 right-2 z-50">
              <SearchResults
                search={search}
                onSelectChat={(chatId, user) => {
                  setActiveChat({ chatId, user });
                  setSearch(""); // close dropdown
                  setSearchFocused(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Recent chats */}
        <RecentChats
          onSelectChat={(chatId, user) => {
            setActiveChat({ chatId, user });
          }}
          activeChatId={activeChat?.chatId ?? ""}
        />
      </aside>

      {/* Right panel - hidden on mobile if no active chat */}
      <main className={cn(
        "flex-1 h-full overflow-hidden flex flex-col min-h-0",
        activeChat?.chatId ? "flex" : "hidden md:flex"
      )}>
        {activeChat?.chatId ? (
          <ChatWindow activeChat={activeChat} />
        ) : (
          <EmptyChatState />
        )}
      </main>
    </div>
  );
}
