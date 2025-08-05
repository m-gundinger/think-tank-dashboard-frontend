import { useState } from "react";
import { ReportingOverview } from "@/features/analytics/components/ReportingOverview";
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

export function ReportingPage() {
  const [workspaceId, setWorkspaceId] = useState<string | undefined>();
  const [projectId, setProjectId] = useState<string | undefined>();

  const { data: workspacesData } = useGetWorkspaces();
  const { data: projectsData } = useGetProjects(workspaceId);

  const handleWorkspaceChange = (id: string) => {
    setWorkspaceId(id === "all" ? undefined : id);
    setProjectId(undefined);
  };

  const handleProjectChange = (id: string) => {
    setProjectId(id === "all" ? undefined : id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-64">
          <Label>Filter by Workspace</Label>
          <Select onValueChange={handleWorkspaceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Global Overview" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Global Overview</SelectItem>
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
      <ReportingOverview scope={{ workspaceId, projectId }} />
    </div>
  );
}
