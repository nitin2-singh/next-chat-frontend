import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChats } from "@/hooks/chat";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";

export function RecentChats({
  onSelectChat,
  activeChatId,
}: {
  onSelectChat: (chatId: string, user: User) => void;
  activeChatId: string | null;
}) {
  const { data, isLoading } = useChats();

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
        {data.map((chat) => (
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
              <p className="text-xs text-muted-foreground truncate">
                {chat.lastMessage?.content ?? "No messages yet"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
