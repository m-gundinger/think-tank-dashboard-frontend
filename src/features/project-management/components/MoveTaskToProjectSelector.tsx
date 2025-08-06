import { useState } from "react";
import { Button } from "@/components/ui/button";
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

interface MoveTaskToProjectSelectorProps {
  onMove: (projectId: string) => void;
}

export function MoveTaskToProjectSelector({
  onMove,
}: MoveTaskToProjectSelectorProps) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<
    string | undefined
  >();
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >();

  const { data: workspacesData, isLoading: isLoadingWorkspaces } =
    useGetWorkspaces();
  const { data: projectsData, isLoading: isLoadingProjects } =
    useGetProjects(selectedWorkspaceId);

  const handleMove = () => {
    if (selectedProjectId) {
      onMove(selectedProjectId);
    }
  };

  return (
    <div className="space-y-2 rounded-md border p-3">
      <h3 className="text-sm font-semibold">Move to Project</h3>
      <div className="space-y-2">
        <Label>Workspace</Label>
        <Select
          onValueChange={setSelectedWorkspaceId}
          disabled={isLoadingWorkspaces}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a workspace..." />
          </SelectTrigger>
          <SelectContent>
            {workspacesData?.data.map((ws) => (
              <SelectItem key={ws.id} value={ws.id}>
                {ws.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Project</Label>
        <Select
          onValueChange={setSelectedProjectId}
          disabled={!selectedWorkspaceId || isLoadingProjects}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a project..." />
          </SelectTrigger>
          <SelectContent>
            {projectsData?.data.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={handleMove}
        disabled={!selectedProjectId}
        className="w-full"
        size="sm"
      >
        Move Task
      </Button>
    </div>
  );
}
