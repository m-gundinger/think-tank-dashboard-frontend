import { useMemo } from "react";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { useGetProjectMembers } from "@/features/projects/api/useGetProjectMembers";
import { useGetUsers } from "@/features/admin/users/api/useGetUsers";
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
};

export function AssigneeSelector({
  projectId,
  workspaceId,
  selectedIds,
  onSelectionChange,
}: AssigneeSelectorProps) {
  const { data: projectMembersData, isLoading: isLoadingProjectMembers } =
    useGetProjectMembers(workspaceId!, projectId!, { enabled: !!projectId });
  const { data: allUsersData, isLoading: isLoadingAllUsers } = useGetUsers({
    enabled: !projectId,
  });

  const isLoading = isLoadingProjectMembers || isLoadingAllUsers;

  const availableUsers: SelectableUser[] = useMemo(() => {
    if (projectId) {
      return (
        projectMembersData?.map((member: any) => ({
          id: member.userId,
          name: member.name,
        })) || []
      );
    }

    return (
      allUsersData?.data?.map((user: any) => ({
        id: user.id,
        name: user.name,
      })) || []
    );
  }, [projectId, projectMembersData, allUsersData]);

  const selectedUsers =
    availableUsers.filter((user) => selectedIds.includes(user.id)) || [];

  const handleSelect = (userId: string) => {
    const isSelected = selectedIds.includes(userId);
    const newSelectedIds = isSelected
      ? selectedIds.filter((id) => id !== userId)
      : [...selectedIds, userId];
    onSelectionChange(newSelectedIds);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "h-auto w-full justify-between",
              !selectedIds.length && "text-muted-foreground"
            )}
            disabled={isLoading}
          >
            <div className="flex flex-wrap items-center gap-1">
              {selectedUsers.length > 0
                ? selectedUsers.map((user: SelectableUser) => (
                    <Badge variant="secondary" key={user.id}>
                      {user.name}
                    </Badge>
                  ))
                : "Select assignees..."}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {availableUsers.map((user: SelectableUser) => (
                <CommandItem
                  value={user.name}
                  key={user.id}
                  onSelect={() => handleSelect(user.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedIds.includes(user.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
