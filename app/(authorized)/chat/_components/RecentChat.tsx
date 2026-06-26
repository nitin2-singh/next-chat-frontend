import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChats } from "@/hooks/chat";
import { useChatStore } from "@/store/chat";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";

function formatTime(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function RecentChats({
  onSelectChat,
  activeChatId,
}: {
  onSelectChat: (chatId: string, user: User) => void;
  activeChatId: string | null;
}) {
  const { data, isLoading } = useChats();
  const { typingChats } = useChatStore();

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">Loading chats…</div>
    );
  }

  if (!data?.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground">No chats yet</div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-1 p-1">
        {data.map((chat) => {
          const isTyping = typingChats[chat.chatId];

          return (
            <button
              key={chat.chatId}
              onClick={() => onSelectChat(chat.chatId, chat.user)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition",
                activeChatId === chat.chatId ? "bg-muted" : "hover:bg-muted"
              )}
            >
              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {chat.user.firstName[0]}
                  {chat.user.lastName[0]}
                </AvatarFallback>
              </Avatar>

              {/* Text */}
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium leading-none">
                  {chat.user.firstName} {chat.user.lastName}
                </p>
                {isTyping ? (
                  <p className="text-xs text-green-500 font-semibold animate-pulse mt-1">
                    Typing…
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {chat.lastMessage?.content ?? "No messages yet"}
                  </p>
                )}
              </div>

              {/* Right Side Info */}
              <div className="flex flex-col items-end gap-1.5 self-start pt-0.5">
                <span className="text-[10px] text-muted-foreground">
                  {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : ""}
                </span>
                {chat.unreadCount && chat.unreadCount > 0 ? (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-black ring-2 ring-background">
                    {chat.unreadCount}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
