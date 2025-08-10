import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tag } from "lucide-react";
import { TaskTypeSelector } from "../../TaskTypeSelector";
import { Task } from "@/types";

interface BulkTaskTypeSelectorProps {
  selectedTaskIds: string[];
  tasks: Task[];
  onUpdate: (updates: { taskTypeId: string | null }) => void;
}

export function BulkTaskTypeSelector({
  selectedTaskIds,
  tasks,
  onUpdate,
}: BulkTaskTypeSelectorProps) {
  const firstSelectedTask = tasks.find((t) => t.id === selectedTaskIds[0]);

  if (!firstSelectedTask?.projectId) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Tag className="mr-2 h-4 w-4" />
          Set Type
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <TaskTypeSelector
          projectId={firstSelectedTask.projectId}
          workspaceId={firstSelectedTask.workspaceId}
          value={null}
          onValueChange={(value) => onUpdate({ taskTypeId: value })}
        />
      </PopoverContent>
    </Popover>
  );
}