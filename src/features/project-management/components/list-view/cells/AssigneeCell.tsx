import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAbsoluteUrl } from "@/lib/utils";
import { Task, TaskAssignee } from "@/types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AssigneeSelector } from "../../AssigneeSelector";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";

const useAssigneeMutations = (task: Task) => {
  const isProjectTask = !!task.projectId;
  const workspaceId = task.workspaceId;
  const projectId = task.projectId;
  const invalidateQueries: (string | null | undefined)[][] = [
    ["task", task.id],
    ["myTasks"],
  ];
  if (projectId) {
    invalidateQueries.push(["tasks", projectId]);
  }

  const assignMutation = useApiMutation({
    mutationFn: (userId: string) => {
      const url = isProjectTask
        ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}/assignees`
        : `/tasks/${task.id}/assignees`;
      return api.post(url, { userId });
    },
    invalidateQueries,
  });

  const unassignMutation = useApiMutation({
    mutationFn: (userId: string) => {
      const url = isProjectTask
        ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}/assignees/${userId}`
        : `/tasks/${task.id}/assignees/${userId}`;
      return api.delete(url);
    },
    invalidateQueries,
  });

  return { assignMutation, unassignMutation };
};

export function AssigneeCell({ task }: { task: Task }) {
  const { assignMutation, unassignMutation } = useAssigneeMutations(task);

  const handleSelectionChange = (newIds: string[]) => {
    const currentIds = task.assignees.map((a) => a.id);

    const added = newIds.filter((id) => !currentIds.includes(id));
    const removed = currentIds.filter((id) => !newIds.includes(id));

    added.forEach((userId) => assignMutation.mutate(userId));
    removed.forEach((userId) => unassignMutation.mutate(userId));
  };

  const MAX_VISIBLE_AVATARS = 3;
  const visibleAssignees = task.assignees.slice(0, MAX_VISIBLE_AVATARS);
  const hiddenCount = task.assignees.length - MAX_VISIBLE_AVATARS;

  return (
    <div className="flex items-center -space-x-2">
      {visibleAssignees.map((assignee: TaskAssignee) => (
        <Avatar
          key={assignee.id}
          className="h-7 w-7 rounded-full ring-2 ring-surface"
        >
          <AvatarImage
            src={getAbsoluteUrl(assignee.avatarUrl)}
            alt={assignee.name}
          />
          <AvatarFallback>{assignee.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      {hiddenCount > 0 && (
        <Avatar className="h-7 w-7 rounded-full ring-2 ring-surface">
          <AvatarFallback className="bg-muted text-xs text-muted-foreground">
            +{hiddenCount}
          </AvatarFallback>
        </Avatar>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
            className="hover:bg-hover h-7 w-7 flex-shrink-0 rounded-full border-2 border-dashed border-border bg-transparent text-muted-foreground hover:text-foreground"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <AssigneeSelector
            projectId={task.projectId}
            workspaceId={task.workspaceId}
            selectedIds={task.assignees.map((a) => a.id)}
            onSelectionChange={handleSelectionChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
