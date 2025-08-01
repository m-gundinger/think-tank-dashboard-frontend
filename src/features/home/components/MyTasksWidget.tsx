import { DashboardWidget } from "./DashboardWidget";
import { useApiResource } from "@/hooks/useApiResource";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";

export function MyTasksWidget() {
  const { data, isLoading } = useApiResource<Task>("tasks/my-tasks", [
    "myTasks",
  ]).useGetAll();

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