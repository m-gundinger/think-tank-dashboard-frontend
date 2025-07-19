// src/features/teams/components/ManageTeamMembers.tsx
import { useGetUsers } from "@/features/admin/users/api/useGetUsers";
import { useAddUserToTeam } from "../api/useAddUserToTeam";
import { useRemoveUserFromTeam } from "../api/useRemoveUserFromTeam";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, UserPlus, XIcon } from "lucide-react";
import { getAbsoluteUrl } from "@/lib/utils";
interface ManageTeamMembersProps {
  team: any;
  workspaceId: string;
}

export function ManageTeamMembers({
  team,
  workspaceId,
}: ManageTeamMembersProps) {
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers({
    limit: 1000,
  });
  const addUserMutation = useAddUserToTeam(workspaceId, team.id);
  const removeUserMutation = useRemoveUserFromTeam(workspaceId, team.id);

  const memberIds = new Set(team.members.map((m: any) => m.id));
  const availableUsers =
    usersData?.data.filter((user: any) => !memberIds.has(user.id)) || [];
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold">Current Members</h4>
        <div className="mt-2 flex min-h-[40px] flex-wrap items-center gap-2 rounded-md border p-2">
          {team.members.length > 0 ? (
            team.members.map((member: any) => (
              <Badge key={member.id} variant="secondary" className="pr-1">
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage
                    src={getAbsoluteUrl(member.avatarUrl)}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{member.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-1 h-4 w-4"
                  onClick={() => removeUserMutation.mutate(member.id)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground px-2 text-sm">
              No members in this team.
            </p>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-semibold">Add Member</h4>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
              disabled={isLoadingUsers}
            >
              Select user to add...
              <UserPlus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search users..." />
              <CommandList>
                <CommandEmpty>No users available.</CommandEmpty>
                <CommandGroup>
                  {availableUsers.map((user: any) => (
                    <CommandItem
                      value={user.name}
                      key={user.id}
                      onSelect={() => {
                        addUserMutation.mutate(user.id);
                      }}
                    >
                      <Check className="mr-2 h-4 w-4 opacity-0" />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
