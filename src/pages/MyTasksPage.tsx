import { MyTasksList } from "@/features/tasks/components/MyTasksList";
import { CreateTaskDialog } from "@/features/tasks/components/CreateTaskDialog";
import { TaskDetailModal } from "@/features/tasks/components/TaskDetailModal";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ListTasksQuery } from "@/features/tasks/task.types";

export function MyTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("taskId");

  const [filter, setFilter] = useState("all_assigned");
  const [sortBy, setSortBy] = useState("priority");

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

  const getFilterParams = (): Partial<
    Pick<ListTasksQuery, "userRole" | "taskOrigin">
  > => {
    switch (filter) {
      case "created_standalone":
        return { userRole: "creator", taskOrigin: "standalone" };
      case "created_project":
        return { userRole: "creator", taskOrigin: "project" };
      case "assigned_standalone":
        return { userRole: "assignee", taskOrigin: "standalone" };
      case "assigned_project":
        return { userRole: "assignee", taskOrigin: "project" };
      case "all_assigned":
        return { userRole: "assignee" };
      default:
        return {};
    }
  };

  const queryParams: Partial<ListTasksQuery> = {
    ...getFilterParams(),
    sortBy: sortBy as ListTasksQuery["sortBy"],
    sortOrder: "desc",
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
          <div className="flex items-center gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="filter">Filter by</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger id="filter" className="w-[240px]">
                  <SelectValue placeholder="Filter tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All My Tasks</SelectItem>
                  <SelectItem value="all_assigned">
                    All Assigned to Me (Default)
                  </SelectItem>
                  <SelectItem value="assigned_project">
                    Assigned to Me (from Projects)
                  </SelectItem>
                  <SelectItem value="assigned_standalone">
                    Assigned to Me (Standalone)
                  </SelectItem>
                  <SelectItem value="created_project">
                    Created by Me (in Projects)
                  </SelectItem>
                  <SelectItem value="created_standalone">
                    Created by Me (Standalone)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="sort">Sort by</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort" className="w-[180px]">
                  <SelectValue placeholder="Sort tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="createdAt">Creation Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="self-end">
              <CreateTaskDialog />
            </div>
          </div>
        </div>
        <MyTasksList onTaskSelect={handleTaskSelect} query={queryParams} />
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
