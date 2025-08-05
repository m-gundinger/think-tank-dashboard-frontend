import { useState, useEffect } from "react";
import { DashboardList } from "@/features/analytics/components/DashboardList";
import { DashboardForm } from "@/features/analytics/components/DashboardForm";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
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

export function DashboardsPage() {
  const params = useParams<{ workspaceId?: string; projectId?: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
            description="Create a dashboard to track your metrics."
            form={DashboardForm}
            formProps={{ scope }}
            resourcePath={"dashboards"}
            resourceKey={
              scope.projectId
                ? ["dashboards", scope.projectId]
                : scope.workspaceId
                  ? ["dashboards", scope.workspaceId]
                  : ["dashboards", "user"]
            }
          />
        </div>
      </div>
      <DashboardList {...scope} />
    </div>
  );
}
