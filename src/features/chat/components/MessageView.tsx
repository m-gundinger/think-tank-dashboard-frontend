import { useGetMessages } from "../api/useGetMessages";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageViewProps {
  threadId: string | null;
}

export function MessageView({ threadId }: MessageViewProps) {
  const { data: messages, isLoading } = useGetMessages(threadId);

  if (!threadId) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground">
          Select a conversation to start chatting.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-12 w-1/2 self-end" />
        <Skeleton className="h-12 w-3/4" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages?.map((msg) => (
        <div key={msg.id} className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{msg.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{msg.author}</p>
            <div className="bg-muted mt-1 rounded-md p-2">{msg.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
