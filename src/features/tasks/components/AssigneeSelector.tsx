import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, UserPlus, X } from "lucide-react";
import { useGetProjectMembers } from "@/features/projects/api/useGetProjectMembers";
import { useGetUsers } from "@/features/admin/users/api/useGetUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAbsoluteUrl } from "@/lib/utils";
import { FormControl } from "@/components/ui/form";

interface AssigneeSelectorProps {
  projectId?: string | null;
  workspaceId?: string;
  selectedIds: string[];
  onSelectionChange: (newIds: string[]) => void;
}

type SelectableUser = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export function AssigneeSelector({
  projectId,
  workspaceId,
  selectedIds,
  onSelectionChange,
}: AssigneeSelectorProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data: projectMembersData, isLoading: isLoadingProjectMembers } =
    useGetProjectMembers(workspaceId!, projectId!, { enabled: !!projectId });
  const { data: allUsersData, isLoading: isLoadingAllUsers } = useGetUsers({
    limit: 1000,
    enabled: !projectId,
  });
  const isLoading = isLoadingProjectMembers || isLoadingAllUsers;

  const availableUsers: SelectableUser[] = useMemo(() => {
    if (projectId) {
      return (
        projectMembersData?.map((member: any) => ({
          id: member.userId,
          name: member.name,
          avatarUrl: member.avatarUrl,
        })) || []
      );
    }
    return (
      allUsersData?.data?.map((user: any) => ({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      })) || []
    );
  }, [projectId, projectMembersData, allUsersData]);

  const selectedUsers = useMemo(
    () => availableUsers.filter((user) => selectedIds.includes(user.id)) || [],
    [availableUsers, selectedIds]
  );

  const unassignedUsers = useMemo(
    () => availableUsers.filter((user) => !selectedIds.includes(user.id)),
    [availableUsers, selectedIds]
  );

  const handleSelect = (userId: string) => {
    onSelectionChange([...selectedIds, userId]);
    setPopoverOpen(false);
  };

  const handleRemove = (userId: string) => {
    onSelectionChange(selectedIds.filter((id) => id !== userId));
  };

  return (
    <FormControl>
      <div className="border-input flex min-h-9 flex-wrap items-center gap-2 rounded-md border p-1">
        {selectedUsers.map((user) => (
          <Badge
            key={user.id}
            variant="secondary"
            className="flex items-center gap-2 rounded-full bg-gray-100 py-0.5 pr-2 pl-0.5"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={getAbsoluteUrl(user.avatarUrl)}
                alt={user.name}
              />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-normal">{user.name}</span>
            <Button
              size="icon"
              variant="ghost"
              type="button"
              className="ml-1 h-4 w-4 rounded-full"
              onClick={() => handleRemove(user.id)}
            >
              <X className="text-muted-foreground hover:text-primary h-3 w-3" />
            </Button>
          </Badge>
        ))}

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={isLoading}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Assign user..." />
              <CommandList>
                <CommandEmpty>No available users found.</CommandEmpty>
                <CommandGroup>
                  {unassignedUsers.map((user: SelectableUser) => (
                    <CommandItem
                      key={user.id}
                      value={user.name}
                      onSelect={() => handleSelect(user.id)}
                      className="flex items-center"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={getAbsoluteUrl(user.avatarUrl)}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1 truncate">{user.name}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedIds.includes(user.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </FormControl>
  );
}
