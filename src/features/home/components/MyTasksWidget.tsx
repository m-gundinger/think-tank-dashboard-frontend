import { DashboardWidget } from "./DashboardWidget";
import { useApiResource } from "@/hooks/useApiResource";
import { TaskStatus } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function MyTasksWidget() {
  const { data, isLoading } = useApiResource("tasks/my-tasks", [
    "myTasks",
  ]).useGetAll({ limit: 10, status: TaskStatus.IN_PROGRESS });

  return (
    <DashboardWidget title="My Open Tasks">
      <div className="space-y-2">
        {isLoading && <p>Loading tasks...</p>}
        {data?.data?.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No open tasks assigned to you.
          </p>
        )}
        {data?.data?.map((task: any) => (
          <div key={task.id} className="text-sm">
            {task.title}
          </div>
        ))}
        <Button variant="link" asChild className="p-0">
          <Link to="/my-tasks">View all tasks</Link>
        </Button>
      </div>
    </DashboardWidget>
  );
}
