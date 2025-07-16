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
import { useUpdateTask } from "../api/useUpdateTask";
import { TaskStatus, TaskPriority } from "@/types";

export function TaskDetailSidebar({ task, workspaceId, projectId }: any) {
  const updateTaskMutation = useUpdateTask(workspaceId, projectId, task.id);

  const handleUpdate = (field: "status" | "priority", value: string) => {
    updateTaskMutation.mutate({ [field]: value });
  };

  return (
    <div className="col-span-1 space-y-6 overflow-y-auto pr-1">
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
      <TaskAssignees
        task={task}
        workspaceId={workspaceId}
        projectId={projectId}
      />
      <TaskCustomFields
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
