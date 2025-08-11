import { useState, useEffect } from "react";
import { DashboardForm } from "@/features/analytics/components/DashboardForm";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useGetProjects } from "@/features/project-management/api/useGetProjects";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { useManageDashboards } from "@/features/analytics/api/useManageDashboards";
import { DashboardCard } from "@/features/analytics/components/DashboardCard";
import { Dashboard } from "@/types";

export function DashboardsPage() {
  const params = useParams<{ workspaceId?: string; projectId?: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(
    null
  );
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(
    params.workspaceId
  );
  const [projectId, setProjectId] = useState<string | undefined>(
    params.projectId
  );

  const { data: workspacesData } = useGetWorkspaces();
  const { data: projectsData } = useGetProjects(workspaceId);

  useEffect(() => {
    setWorkspaceId(params.workspaceId);
    setProjectId(params.projectId);
  }, [params.workspaceId, params.projectId]);

  const handleWorkspaceChange = (id: string) => {
    const newWorkspaceId = id === "all" ? undefined : id;
    setWorkspaceId(newWorkspaceId);
    setProjectId(undefined);
  };

  const handleProjectChange = (id: string) => {
    setProjectId(id === "all" ? undefined : id);
  };

  const scope = {
    workspaceId: workspaceId,
    projectId: projectId,
  };

  const dashboardResource = useManageDashboards(scope);
  const { data, isLoading, isError } = dashboardResource.useGetAll();

  const resourceKey = scope.projectId
    ? ["dashboards", scope.projectId]
    : scope.workspaceId
      ? ["dashboards", scope.workspaceId]
      : ["dashboards", "user"];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        {!params.workspaceId && (
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Label>Filter by Workspace</Label>
              <Select
                onValueChange={handleWorkspaceChange}
                value={workspaceId || "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a workspace..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">My Dashboards</SelectItem>
                  {workspacesData?.data.map((ws) => (
                    <SelectItem key={ws.id} value={ws.id}>
                      {ws.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-64">
              <Label>Filter by Project</Label>
              <Select
                onValueChange={handleProjectChange}
                disabled={!workspaceId || !projectsData?.data}
                value={projectId || "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects in Workspace</SelectItem>
                  {projectsData?.data.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <div className={params.workspaceId ? "flex w-full justify-end" : ""}>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Dashboard
          </Button>
        </div>
      </div>
      {isLoading && <div>Loading dashboards...</div>}
      {isError && <div>Error loading dashboards.</div>}
      {!isLoading && !isError && (
        <>
          {data && data.data.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((dashboard: Dashboard) => (
                <DashboardCard
                  dashboard={dashboard}
                  key={dashboard.id}
                  onEdit={() => setEditingDashboardId(dashboard.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No dashboards have been created yet. Create one to begin!
            </p>
          )}
        </>
      )}

      <ResourceCrudDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create a new dashboard"
        description="Create a dashboard to track your metrics."
        form={DashboardForm}
        formProps={{ scope }}
        resourcePath={"dashboards"}
        resourceKey={resourceKey}
      />
      <ResourceCrudDialog
        isOpen={!!editingDashboardId}
        onOpenChange={(isOpen) => !isOpen && setEditingDashboardId(null)}
        resourceId={editingDashboardId}
        resourcePath={"dashboards"}
        resourceKey={resourceKey}
        title="Edit Dashboard"
        description="Make changes to your dashboard here. Click save when you're done."
        form={DashboardForm}
        formProps={{ scope }}
      />
    </div>
  );
}
