import { useParams } from "react-router-dom";
import GridLayout, { Layout } from "react-grid-layout";
import { useApiResource } from "@/hooks/useApiResource";
import { WidgetRenderer } from "@/features/widgets/components/WidgetRenderer";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useUpdateWidget } from "@/features/widgets/api/useUpdateWidget";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateWidgetForm } from "@/features/widgets/components/CreateWidgetForm";

export function DashboardDetailPage() {
  const { workspaceId, projectId, dashboardId } = useParams<{
    workspaceId: string;
    projectId?: string;
    dashboardId: string;
  }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId || !dashboardId) {
    return <div>Missing ID parameter.</div>;
  }

  const resourceUrl = projectId
    ? `/workspaces/${workspaceId}/projects/${projectId}/dashboards`
    : `/workspaces/${workspaceId}/dashboards`;

  const resourceKey = projectId
    ? ["dashboards", projectId]
    : ["dashboards", workspaceId];

  const dashboardResource = useApiResource(resourceUrl, resourceKey);

  const { data: dashboardData, isLoading } =
    dashboardResource.useGetOne(dashboardId);

  const updateWidgetMutation = useUpdateWidget(
    workspaceId,
    projectId!,
    dashboardId
  );

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (!dashboardData?.widgets) return;
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

  const widgetResourcePath = projectId
    ? `/workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}/widgets`
    : `/workspaces/${workspaceId}/dashboards/${dashboardId}/widgets`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dashboardData.name}
          </h1>
          <p className="text-muted-foreground">{dashboardData.description}</p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Widget
            </Button>
          }
          title="Add a New Widget"
          description="Select a widget type and configure it to visualize your data."
          form={CreateWidgetForm}
          formProps={{ workspaceId, projectId, dashboardId }}
          resourcePath={widgetResourcePath}
          resourceKey={["dashboard", dashboardId]}
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
