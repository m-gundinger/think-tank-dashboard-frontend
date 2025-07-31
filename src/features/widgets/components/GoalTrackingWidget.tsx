import { useGetWidgetData } from "../api/useGetWidgetData";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { KeyResultType } from "@/types";

const formatKeyResultValue = (value: number, type: KeyResultType) => {
  switch (type) {
    case KeyResultType.PERCENTAGE:
      return `${value}%`;
    case KeyResultType.CURRENCY:
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    case KeyResultType.BOOLEAN:
      return value > 0 ? "Done" : "Not Done";
    default:
      return value.toLocaleString();
  }
};

export function GoalTrackingWidget({ widget, workspaceId, projectId }: any) {
  const { data, isLoading } = useGetWidgetData(
    workspaceId,
    projectId,
    widget.dashboardId,
    widget.id
  );

  if (isLoading) return <Skeleton className="h-full w-full" />;

  const payload = data?.payload;
  if (!payload)
    return (
      <div className="text-muted-foreground text-sm">
        Please configure this widget.
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Progress value={payload.overallProgress} className="h-2 flex-grow" />
        <span className="text-sm font-semibold">
          {payload.overallProgress.toFixed(0)}%
        </span>
      </div>
      <div className="space-y-2">
        {payload.keyResults?.map((kr: any) => (
          <div key={kr.id} className="text-xs">
            <p className="truncate font-medium">{kr.name}</p>
            <p className="text-muted-foreground">
              {formatKeyResultValue(kr.currentValue, kr.type)} /{" "}
              {formatKeyResultValue(kr.targetValue, kr.type)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
