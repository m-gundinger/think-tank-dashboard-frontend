import { TaskAssignees } from "./TaskAssignees";
import { TimeLogSection } from "@/features/timelogs/components/TimeLogSection";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCustomFields } from "./TaskCustomFields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiResource } from "@/hooks/useApiResource";
import { TaskStatus, TaskPriority } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TaskDocuments } from "./TaskDocuments";
import { EditableField } from "@/components/ui/EditableField";
import { RecurrenceSelector } from "./RecurrenceSelector";
import { TaskTypeSelector } from "@/features/task-types/components/TaskTypeSelector";
export function TaskDetailSidebar({ task, workspaceId, projectId }: any) {
  const taskResource = useApiResource(
    projectId
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks`
      : "/tasks",
    projectId ? ["tasks", projectId] : ["myTasks"]
  );
  const updateTaskMutation = taskResource.useUpdate();

  const handleUpdate = (
    field:
      | "status"
      | "priority"
      | "dueDate"
      | "storyPoints"
      | "recurrenceRule"
      | "taskTypeId",
    value: string | null | number
  ) => {
    updateTaskMutation.mutate({ id: task.id, data: { [field]: value } });
  };

  return (
    <div className="col-span-1 space-y-6 pr-1">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Status</h3>
        <Select
          value={task.status}
          onValueChange={(value) => handleUpdate("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Set status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {projectId && workspaceId && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Task Type</h3>
          <TaskTypeSelector
            workspaceId={workspaceId}
            projectId={projectId}
            value={task.taskTypeId}
            onValueChange={(value) => handleUpdate("taskTypeId", value)}
          />
        </div>
      )}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Priority</h3>
        <Select
          value={task.priority}
          onValueChange={(value) => handleUpdate("priority", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Set priority" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskPriority).map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Story Points</h3>
        <EditableField
          initialValue={task.storyPoints?.toString() || ""}
          onSave={(value) =>
            handleUpdate(
              "storyPoints",
              value === "" ? null : parseInt(value, 10)
            )
          }
          placeholder="Set points"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Recurrence</h3>
        <RecurrenceSelector
          value={task.recurrenceRule}
          onSave={(value) => handleUpdate("recurrenceRule", value)}
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Due Date</h3>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "flex-grow justify-start text-left font-normal",
                  !task.dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {task.dueDate ? (
                  format(new Date(task.dueDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={task.dueDate ? new Date(task.dueDate) : undefined}
                onSelect={(date) =>
                  handleUpdate("dueDate", date?.toISOString() ?? null)
                }
              />
            </PopoverContent>
          </Popover>
          {task.dueDate && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 flex-shrink-0"
              onClick={() => handleUpdate("dueDate", null)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <TaskAssignees task={task} />
      <TaskCustomFields
        task={task}
        workspaceId={workspaceId}
        projectId={projectId}
      />
      <TaskDocuments
        task={task}
        workspaceId={workspaceId}
        projectId={projectId}
      />
      <TimeLogSection
        workspaceId={workspaceId}
        projectId={projectId}
        taskId={task.id}
      />
    </div>
  );
}

export function TaskDetailSidebarSkeleton() {
  return (
    <div className="col-span-1 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
