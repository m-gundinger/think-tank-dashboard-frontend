// FILE: src/pages/MyTasksPage.tsx

import { MyTasksList } from "@/features/tasks/components/MyTasksList";
import { CreateTaskDialog } from "@/features/tasks/components/CreateTaskDialog";
import { TaskDetailModal } from "@/features/tasks/components/TaskDetailModal";
import { useSearchParams } from "react-router-dom";

export function MyTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("taskId");

  const handleTaskSelect = (taskId: string | null) => {
    setSearchParams((params) => {
      if (taskId) {
        params.set("taskId", taskId);
      } else {
        params.delete("taskId");
      }
      return params;
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-muted-foreground">
              All tasks assigned to you or created by you.
            </p>
          </div>
          <CreateTaskDialog />
        </div>
        <MyTasksList onTaskSelect={handleTaskSelect} />
      </div>

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleTaskSelect(null);
        }}
        onTaskSelect={handleTaskSelect}
      />
    </>
  );
}
