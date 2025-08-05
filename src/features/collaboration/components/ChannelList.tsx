import { useGetWorkspaceChannels } from "../api/useManageChat";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";

interface ChannelListProps {
  workspaceId: string;
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
}

export function ChannelList({
  workspaceId,
  selectedThreadId,
  onSelectThread,
}: ChannelListProps) {
  const { data: channels, isLoading } = useGetWorkspaceChannels(workspaceId);

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      <h3 className="text-muted-foreground px-2 text-xs font-semibold uppercase">
        Channels
      </h3>
      {channels
        ?.filter((c) => !c.isPrivate)
        .map((channel) => (
          <button
            key={channel.id}
            onClick={() => onSelectThread(channel.id)}
            className={cn(
              "text-muted-foreground hover:bg-accent flex w-full items-center gap-2 rounded-md p-2 text-left text-sm",
              selectedThreadId === channel.id &&
                "bg-accent text-primary font-semibold"
            )}
          >
            <Hash className="h-4 w-4" />
            {channel.name}
          </button>
        ))}
    </div>
  );
}
