// FILE: src/components/layout/ActiveUsers.tsx
import { usePresenceStore } from "@/store/presence";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAbsoluteUrl } from "@/lib/utils";

interface Member {
  socketId: string;
  user: {
    name?: string;
    avatarUrl?: string;
  };
}

export function ActiveUsers() {
  const members = usePresenceStore(
    (state: { members: Member[] }) => state.members
  );
  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {members.map((member: Member) => (
          <Tooltip key={member.socketId}>
            <TooltipTrigger asChild>
              <Avatar className="h-7 w-7 border-2 border-white">
                <AvatarImage
                  src={getAbsoluteUrl(member.user.avatarUrl)}
                  alt={member.user.name}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback>{member.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
