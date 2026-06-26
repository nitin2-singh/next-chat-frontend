import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useStartChat } from "@/hooks/chat";
import { useDebounce } from "@/hooks/use-debounce";
import { useUserSearch } from "@/hooks/user";
import { User } from "@/types/user";

export function SearchResults({
  search,
  onSelectChat,
}: {
  search: string;
  onSelectChat: (chatId: string, user: User) => void;
}) {
  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useUserSearch(debouncedSearch);
  const startChat = useStartChat();

  if (isLoading) {
    return (
      <Card className="rounded-xl shadow-lg border p-4 text-sm bg-popover text-popover-foreground">
        Searching…
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="rounded-xl shadow-lg border p-4 text-sm text-muted-foreground bg-popover text-popover-foreground">
        No users found
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-lg border bg-popover text-popover-foreground overflow-hidden">
      <div className="px-3 py-2 border-b text-xs font-semibold text-muted-foreground bg-muted/40">
        {debouncedSearch ? "Search Results" : "Suggested Users"}
      </div>
      <ScrollArea className="max-h-64">
        <CardContent className="p-1">
          {data.map((user) => (
            <button
              key={user.id}
              disabled={startChat.isPending}
              className="
                flex w-full items-center gap-3
                rounded-lg px-3 py-2
                text-left transition
                hover:bg-muted disabled:opacity-50
              "
              onClick={async () => {
                if (startChat.isPending) return;
                const res = await startChat.mutateAsync(user.id);
                onSelectChat(res.chatId, res.user);
              }}
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>

              {/* Text */}
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </button>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
