import { useParams } from "react-router-dom";
import GridLayout, { Layout } from "react-grid-layout";
import { useGetDashboard } from "@/features/dashboards/api/useGetDashboard";
import { WidgetRenderer } from "@/features/widgets/components/WidgetRenderer";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { CreateWidgetDialog } from "@/features/widgets/components/CreateWidgetDialog";
import { useUpdateWidget } from "@/features/widgets/api/useUpdateWidget";

export function DashboardDetailPage() {
  const { workspaceId, projectId, dashboardId } = useParams<{
    workspaceId: string;
    projectId: string;
    dashboardId: string;
  }>();

  if (!workspaceId || !projectId || !dashboardId) {
    return <div>Missing ID parameter.</div>;
  }

  const { data: dashboardData, isLoading } = useGetDashboard(
    workspaceId,
    projectId,
    dashboardId
  );

  const updateWidgetMutation = useUpdateWidget();

  const handleLayoutChange = (newLayout: Layout[]) => {
    const originalLayout = dashboardData.widgets.map((widget: any) => ({
      ...widget.layout,
      i: widget.id,
    }));

    for (const newPos of newLayout) {
      const originalPos = originalLayout.find((o: any) => o.i === newPos.i);

      if (
        originalPos &&
        (originalPos.x !== newPos.x ||
          originalPos.y !== newPos.y ||
          originalPos.w !== newPos.w ||
          originalPos.h !== newPos.h)
      ) {
        updateWidgetMutation.mutate({
          workspaceId,
          projectId,
          dashboardId,
          widgetId: newPos.i,
          widgetData: {
            layout: {
              x: newPos.x,
              y: newPos.y,
              w: newPos.w,
              h: newPos.h,
            },
          },
        });
      }
    }
  };

  if (isLoading) return <div>Loading Dashboard...</div>;
  if (!dashboardData) return <div>Dashboard not found.</div>;

  const layout =
    dashboardData.widgets?.map((widget: any) => ({
      ...widget.layout,
      i: widget.id,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dashboardData.name}
          </h1>
          <p className="text-muted-foreground">{dashboardData.description}</p>
        </div>
        <CreateWidgetDialog
          workspaceId={workspaceId}
          projectId={projectId}
          dashboardId={dashboardId}
        />
      </div>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        isDraggable={true}
        isResizable={true}
        onLayoutChange={handleLayoutChange}
      >
        {dashboardData.widgets?.map((widget: any) => (
          <div key={widget.id}>
            <WidgetRenderer
              widget={widget}
              workspaceId={workspaceId}
              projectId={projectId}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
