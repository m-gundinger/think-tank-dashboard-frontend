import { useGetWidgetData } from "../api/useGetWidgetData";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskListWidget({ widget }: any) {
  const { data, isLoading } = useGetWidgetData(widget.dashboardId, widget.id);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  const payload = data?.payload;
  return (
    <div className="space-y-2">
      {payload?.tasks?.length > 0 ? (
        payload.tasks.map((task: any) => (
          <div
            key={task.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="truncate pr-2">{task.title}</span>
            <Badge variant="outline">{task.status}</Badge>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">
          No tasks match criteria.
        </p>
      )}
    </div>
  );
}