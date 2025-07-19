// src/features/tasks/components/TaskAssignees.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { useGetProjectMembers } from "@/features/projects/api/useGetProjectMembers";
import { useGetUsers } from "@/features/admin/users/api/useGetUsers";
import { Check, UserPlus, X } from "lucide-react";
import { useAssignUser } from "../api/useAssignUser";
import { useUnassignUser } from "../api/useUnassignUser";
import { useAssignStandaloneUser } from "../api/useAssignStandaloneUser";
import { useUnassignStandaloneUser } from "../api/useUnassignStandaloneUser";
import { cn, getAbsoluteUrl } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
export function TaskAssignees({ task }: any) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const isProjectTask = !!task.projectId;
  const workspaceId = task.workspaceId;
  const projectId = task.projectId;

  const assignMutation = isProjectTask
    ? useAssignUser(workspaceId!, projectId!, task.id)
    : useAssignStandaloneUser(task.id);
  const unassignMutation = isProjectTask
    ? useUnassignUser(workspaceId!, projectId!, task.id)
    : useUnassignStandaloneUser(task.id);

  const { data: projectMembersData, isLoading: isLoadingProjectMembers } =
    useGetProjectMembers(workspaceId!, projectId!, { enabled: isProjectTask });
  const { data: allUsersData, isLoading: isLoadingAllUsers } = useGetUsers({
    limit: 1000,
    enabled: !isProjectTask,
  });
  const isLoading = isLoadingProjectMembers || isLoadingAllUsers;

  const availableUsers = useMemo(() => {
    if (isProjectTask) {
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
  }, [isProjectTask, projectMembersData, allUsersData]);
  const assignedIds = new Set(task.assignees.map((a: any) => a.id));

  const handleSelect = (userId: string) => {
    assignMutation.mutate(userId, {
      onSuccess: () => {
        setPopoverOpen(false);
      },
    });
  };

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Assignees</h3>
      <div className="flex flex-wrap items-center gap-2">
        {task.assignees.map((assignee: any) => (
          <Badge
            key={assignee.id}
            variant="secondary"
            className="flex items-center gap-2 rounded-full bg-gray-100 py-0.5 pr-2 pl-0.5"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={getAbsoluteUrl(assignee.avatarUrl)}
                alt={assignee.name}
              />
              <AvatarFallback>{assignee.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-normal">{assignee.name}</span>
            <Button
              size="icon"
              variant="ghost"
              className="ml-1 h-4 w-4 rounded-full"
              onClick={() => unassignMutation.mutate(assignee.id)}
              disabled={unassignMutation.isPending}
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
                  {availableUsers
                    .filter((user: any) => !assignedIds.has(user.id))
                    .map((user: any) => (
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
                          <AvatarFallback>
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 truncate">{user.name}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            assignedIds.has(user.id)
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
    </div>
  );
}
