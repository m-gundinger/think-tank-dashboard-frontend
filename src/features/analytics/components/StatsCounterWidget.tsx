import { useGetWidgetData } from "../api/useGetWidgetData";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCounterWidget({ widget }: any) {
  const { data, isLoading } = useGetWidgetData(widget.dashboardId, widget.id);
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  const payload = data?.payload;
  return (
    <>
      <div className="text-4xl font-bold">{payload?.count ?? 0}</div>
      <p className="text-xs text-muted-foreground">{payload?.label}</p>
    </>
  );
}