import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Briefcase } from "lucide-react";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useGetProjects } from "@/features/project-management/api/useGetProjects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BulkMoveProjectSelectorProps {
  onUpdate: (updates: { projectId: string }) => void;
}

export function BulkMoveProjectSelector({
  onUpdate,
}: BulkMoveProjectSelectorProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | undefined>();
  const [projectId, setProjectId] = useState<string | undefined>();

  const { data: workspacesData } = useGetWorkspaces();
  const { data: projectsData } = useGetProjects(workspaceId);

  const handleMove = () => {
    if (projectId) {
      onUpdate({ projectId });
      setPopoverOpen(false);
    }
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Briefcase className="mr-2 h-4 w-4" />
          Move to Project
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <div className="space-y-2">
          <Label>Workspace</Label>
          <Select onValueChange={setWorkspaceId}>
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
          <Select onValueChange={setProjectId} disabled={!workspaceId}>
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
        <Button onClick={handleMove} disabled={!projectId} className="w-full">
          Move Tasks
        </Button>
      </PopoverContent>
    </Popover>
  );
}
