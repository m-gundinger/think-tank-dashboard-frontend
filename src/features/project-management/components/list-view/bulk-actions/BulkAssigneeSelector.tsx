import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserPlus } from "lucide-react";
import { AssigneeSelector } from "../../AssigneeSelector";
import { Task } from "@/types";

interface BulkAssigneeSelectorProps {
  selectedTaskIds: string[];
  tasks: Task[];
  onUpdate: (updates: {
    addAssigneeIds?: string[];
    removeAssigneeIds?: string[];
  }) => void;
}

export function BulkAssigneeSelector({
  selectedTaskIds,
  tasks,
  onUpdate,
}: BulkAssigneeSelectorProps) {
  const firstSelectedTask = tasks.find((t) => t.id === selectedTaskIds[0]);

  if (!firstSelectedTask) {
    return null;
  }

  const allAssigneeIds = new Set<string>();
  tasks
    .filter((t) => selectedTaskIds.includes(t.id))
    .forEach((task) => {
      task.assignees.forEach((assignee) => allAssigneeIds.add(assignee.id));
    });

  const handleSelectionChange = (newIds: string[]) => {
    const currentIds = Array.from(allAssigneeIds);
    const addAssigneeIds = newIds.filter((id) => !currentIds.includes(id));
    const removeAssigneeIds = currentIds.filter((id) => !newIds.includes(id));

    onUpdate({ addAssigneeIds, removeAssigneeIds });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Assign
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <AssigneeSelector
          projectId={firstSelectedTask.projectId}
          workspaceId={firstSelectedTask.workspaceId}
          selectedIds={Array.from(allAssigneeIds)}
          onSelectionChange={handleSelectionChange}
        />
      </PopoverContent>
    </Popover>
  );
}
