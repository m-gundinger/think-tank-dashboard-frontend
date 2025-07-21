import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link2, Trash2 } from "lucide-react";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";
import { TaskLinkType } from "@/types";

export function TaskLinks({ task, workspaceId, projectId }: any) {
  const [targetTaskId, setTargetTaskId] = useState("");
  const [linkType, setLinkType] = useState<TaskLinkType>(
    TaskLinkType.RELATES_TO
  );

  const addLinkMutation = useApiMutation({
    mutationFn: (linkData: any) =>
      api.post(
        `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}/links`,
        linkData
      ),
    successMessage: "Task linked successfully.",
    invalidateQueries: [["task", task.id]],
  });

  const removeLinkMutation = useApiMutation({
    mutationFn: (linkId: string) =>
      api.delete(
        `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}/links/${linkId}`
      ),
    successMessage: "Task link removed.",
    invalidateQueries: [["task", task.id]],
  });

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTaskId.trim()) return;
    addLinkMutation.mutate(
      { targetTaskId, type: linkType },
      { onSuccess: () => setTargetTaskId("") }
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Linked Tasks</h3>
      <div className="space-y-1 rounded-md border p-2">
        {task.links?.length > 0 ? (
          task.links.map((link: any) => (
            <div
              key={link.id}
              className="hover:bg-accent flex items-center justify-between p-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <Link2 className="h-3 w-3" />
                <span className="font-medium">
                  {link.type.replace(/_/g, " ")}:
                </span>
                <span className="text-muted-foreground truncate">
                  {link.targetTask.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeLinkMutation.mutate(link.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground p-2 text-center text-xs">
            No linked tasks.
          </p>
        )}
      </div>
      <form onSubmit={handleAddLink} className="flex gap-2">
        <Input
          placeholder="Paste Task ID to link"
          value={targetTaskId}
          onChange={(e) => setTargetTaskId(e.target.value)}
        />
        <Select
          value={linkType}
          onValueChange={(value) => setLinkType(value as TaskLinkType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskLinkType).map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={addLinkMutation.isPending}>
          Link
        </Button>
      </form>
    </div>
  );
}
