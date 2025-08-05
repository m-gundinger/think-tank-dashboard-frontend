import { DashboardList } from "@/features/analytics/components/DashboardList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { DashboardForm } from "@/features/analytics/components/DashboardForm";

export function WorkspaceDashboardListPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Dashboards</h2>
          <p className="text-muted-foreground">
            A list of all dashboards within this workspace.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Dashboard
            </Button>
          }
          title="Create a new dashboard"
          description="Dashboards live inside workspaces and contain widgets to visualize your data."
          form={DashboardForm}
          formProps={{ workspaceId }}
          resourcePath={`dashboards`}
          resourceKey={["dashboards", workspaceId]}
        />
      </div>
      <DashboardList workspaceId={workspaceId} />
    </div>
  );
}
