import { useState, useEffect } from "react";
import { ActivityLog } from "@/features/analytics/components/ActivityLog";
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

export function ActivitiesPage() {
  const params = useParams<{ workspaceId?: string; projectId?: string }>();
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

  return (
    <div className="space-y-4">
      {!params.workspaceId && (
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Label>Filter by Workspace</Label>
            <Select onValueChange={handleWorkspaceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a workspace..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workspaces</SelectItem>
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
              value={projectId}
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
      <ActivityLog scope={{ workspaceId, projectId }} />
    </div>
  );
}