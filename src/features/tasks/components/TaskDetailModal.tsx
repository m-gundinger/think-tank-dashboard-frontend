// FILE: src/features/tasks/components/TaskDetailModal.tsx
// src/features/tasks/components/TaskDetailModal.tsx
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditableField } from "@/components/ui/EditableField";
import { useGetTask } from "../api/useGetTask";
import { useUpdateTask } from "../api/useUpdateTask";
import { useUpdateStandaloneTask } from "../api/useUpdateStandaloneTask";
import { TaskDetailBody } from "./TaskDetailBody";
import {
  TaskDetailSidebar,
  TaskDetailSidebarSkeleton,
} from "./TaskDetailSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CornerUpLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskDetailModalProps {
  taskId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onTaskSelect: (taskId: string | null) => void;
}

export function TaskDetailModal({
  taskId,
  isOpen,
  onOpenChange,
  onTaskSelect,
}: TaskDetailModalProps) {
  const { data: task, isLoading } = useGetTask(taskId);
  const isProjectTask = !!task?.projectId;

  const updateTaskMutation = isProjectTask
    ? useUpdateTask(task?.workspaceId, task?.projectId, taskId!)
    : useUpdateStandaloneTask(taskId!);
  const handleSave = (field: "title" | "description", value: string) => {
    updateTaskMutation.mutate({ [field]: value });
  };
  const renderContent = () => {
    if (isLoading || !task) {
      return (
        <>
          <div className="pr-6">
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6 border-r pr-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
              <TaskDetailSidebarSkeleton />
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <DialogTitle className="flex items-center gap-2 pr-6">
          {task.parentId && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0"
                    onClick={() => onTaskSelect(task.parentId)}
                  >
                    <CornerUpLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to parent task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <EditableField
            key={task.id}
            initialValue={task.title}
            onSave={(newTitle) => handleSave("title", newTitle)}
            className="text-2xl font-bold"
            placeholder="Task Title"
          />
        </DialogTitle>
        <DialogDescription className="text-muted-foreground pr-6 text-xs">
          Task ID: {task.id}
        </DialogDescription>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-3 gap-6">
            <TaskDetailBody
              task={task}
              workspaceId={task.workspaceId}
              projectId={task.projectId}
              onSave={handleSave}
              onTaskSelect={onTaskSelect}
            />
            <TaskDetailSidebar
              task={task}
              workspaceId={task.workspaceId}
              projectId={task.projectId}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-4xl">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
