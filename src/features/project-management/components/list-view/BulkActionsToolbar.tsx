import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskPriority, TaskStatus } from "@/types/api";
import { Task } from "@/types";
import { BulkAssigneeSelector } from "./bulk-actions/BulkAssigneeSelector";
import { BulkDatePicker } from "./bulk-actions/BulkDatePicker";
import { BulkMoveProjectSelector } from "./bulk-actions/BulkMoveProjectSelector";
import { BulkTaskTypeSelector } from "./bulk-actions/BulkTaskTypeSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BulkUpdatePayload = {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  taskTypeId?: string | null;
  dueDate?: Date | null;
  addAssigneeIds?: string[];
  removeAssigneeIds?: string[];
};

interface BulkActionsToolbarProps {
  selectedTaskIds: string[];
  tasks: Task[];
  onBulkDelete: () => void;
  onBulkUpdate: (updates: BulkUpdatePayload) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

export function BulkActionsToolbar({
  selectedTaskIds,
  tasks,
  onBulkDelete,
  onBulkUpdate,
  isDeleting,
  isUpdating,
}: BulkActionsToolbarProps) {
  const isActionPending = isDeleting || isUpdating;

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-2">
      <span className="text-sm font-medium">
        {selectedTaskIds.length} task(s) selected
      </span>
      <div className="flex items-center gap-2">
        <Select
          onValueChange={(status) =>
            onBulkUpdate({ status: status as TaskStatus })
          }
          disabled={isActionPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Change status..." />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(priority) =>
            onBulkUpdate({ priority: priority as TaskPriority })
          }
          disabled={isActionPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Change priority..." />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskPriority).map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <BulkAssigneeSelector
          selectedTaskIds={selectedTaskIds}
          tasks={tasks}
          onUpdate={onBulkUpdate}
        />
        <BulkDatePicker onUpdate={onBulkUpdate} />
        <BulkTaskTypeSelector
          selectedTaskIds={selectedTaskIds}
          tasks={tasks}
          onUpdate={onBulkUpdate}
        />
        <BulkMoveProjectSelector onUpdate={onBulkUpdate} />

        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          disabled={isActionPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
