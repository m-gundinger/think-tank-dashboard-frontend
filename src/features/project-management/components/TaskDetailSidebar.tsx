import { TaskAssignees } from "./TaskAssignees";
import { TimeLogSection } from "@/features/project-management/components/TimeLogSection";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCustomFields } from "./TaskCustomFields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTask } from "../api/useUpdateTask";
import { TaskStatus, TaskPriority } from "@/types/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, X, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TaskDocuments } from "./TaskDocuments";
import { EditableField } from "@/components/ui/EditableField";
import { RecurrenceSelector } from "./RecurrenceSelector";
import { TaskTypeSelector } from "@/features/project-management/components/TaskTypeSelector";
import { Task } from "@/types";
import { TaskAttachments } from "./TaskAttachments";
import { Link } from "react-router-dom";
import { MoveTaskToProjectSelector } from "./MoveTaskToProjectSelector";
import { Label } from "@/components/ui/label";

export function TaskDetailSidebar({
  task,
  workspaceId,
  projectId,
  onSave,
}: {
  task: Task;
  workspaceId: string;
  projectId: string;
  onSave: (field: string, value: any) => void;
}) {
  const updateTaskMutation = useUpdateTask();

  const handleUpdate = (
    field:
      | "status"
      | "priority"
      | "dueDate"
      | "startDate"
      | "storyPoints"
      | "recurrenceRule"
      | "taskTypeId",
    value: string | null | number | Date
  ) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      taskData: { [field]: value },
    });
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

      {task.projectId && task.workspaceId ? (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Project</h3>
          <div className="flex items-center justify-between rounded-md border p-2 text-sm">
            <Link
              to={`/workspaces/${task.workspaceId}/projects/${task.projectId}`}
              className="flex min-w-0 items-center gap-2"
            >
              <Briefcase className="h-4 w-4 flex-shrink-0" />
              <span className="truncate font-medium hover:underline">
                {task.projectName}
              </span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave("projectId", null)}
              disabled={updateTaskMutation.isPending}
            >
              Move to My Tasks
            </Button>
          </div>
        </div>
      ) : (
        <MoveTaskToProjectSelector
          onMove={(newProjectId) => onSave("projectId", newProjectId)}
        />
      )}

      {projectId && workspaceId && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Task Type</h3>
          <TaskTypeSelector
            workspaceId={workspaceId}
            projectId={projectId}
            value={task.taskTypeId ?? null}
            onValueChange={(value) => handleUpdate("taskTypeId", value)}
          />
        </div>
      )}
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
          value={task.recurrenceRule ?? null}
          onSave={(value) => handleUpdate("recurrenceRule", value)}
          startDate={task.startDate}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Dates</h3>
        <div>
          <Label className="text-muted-foreground text-xs">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !task.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {task.startDate ? (
                  format(new Date(task.startDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={task.startDate ? new Date(task.startDate) : undefined}
                onSelect={(date) =>
                  handleUpdate("startDate", date?.toISOString() ?? null)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-muted-foreground text-xs">Due Date</Label>
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
      <TaskAttachments
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