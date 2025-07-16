import { useGetWidgetData } from "../api/useGetWidgetData";

export function StatsCounterWidget({ widget, workspaceId, projectId }: any) {
  const { data, isLoading } = useGetWidgetData(
    workspaceId,
    projectId,
    widget.dashboardId,
    widget.id
  );

  if (isLoading) return <div>Loading...</div>;

  const payload = data?.payload;
  return (
    <>
      <div className="text-4xl font-bold">{payload?.count ?? 0}</div>
      <p className="text-muted-foreground text-xs">{payload?.label}</p>
    </>
  );
}
