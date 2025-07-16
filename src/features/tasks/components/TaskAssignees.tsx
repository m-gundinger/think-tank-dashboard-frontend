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
import { Check, UserPlus, X } from "lucide-react";
import { useAssignUser } from "../api/useAssignUser";
import { useUnassignUser } from "../api/useUnassignUser";
import { cn } from "@/lib/utils";

export function TaskAssignees({ task, workspaceId, projectId }: any) {
  const { data: membersData } = useGetProjectMembers(workspaceId, projectId);
  const assignUserMutation = useAssignUser(workspaceId, projectId, task.id);
  const unassignUserMutation = useUnassignUser(workspaceId, projectId, task.id);

  const assignedIds = new Set(task.assignees.map((a: any) => a.id));

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Assignees</h3>
      <div className="flex flex-wrap items-center gap-2">
        {task.assignees.map((assignee: any) => (
          <div
            key={assignee.id}
            className="flex items-center gap-2 rounded-full bg-gray-100 pr-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatarUrl} />
              <AvatarFallback>{assignee.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{assignee.name}</span>
            <button onClick={() => unassignUserMutation.mutate(assignee.id)}>
              <X className="text-muted-foreground hover:text-primary h-3 w-3" />
            </button>
          </div>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-6 w-6">
              <UserPlus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Assign user..." />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {membersData?.map((member: any) => (
                    <CommandItem
                      key={member.userId}
                      value={member.name}
                      onSelect={() => assignUserMutation.mutate(member.userId)}
                      disabled={assignedIds.has(member.userId)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          assignedIds.has(member.userId)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {member.name}
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
