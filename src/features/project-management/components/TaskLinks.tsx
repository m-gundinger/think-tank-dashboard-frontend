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
import { useManageTaskLinks } from "../api/useManageTaskLinks";
import { TaskLinkType } from "@/types/api";

function TaskLinkItem({ link, onRemove, onUpdateType }: any) {
  const target = link.targetTask ?? link.sourceTask;

  return (
    <div className="hover:bg-accent/50 flex items-center justify-between rounded-md p-2 text-sm">
      <div className="flex min-w-0 items-center gap-2">
        <Link2 className="h-4 w-4 flex-shrink-0" />
        <Select
          defaultValue={link.type}
          onValueChange={(newType) => onUpdateType(link.id, newType)}
        >
          <SelectTrigger className="h-7 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskLinkType).map((type) => (
              <SelectItem key={type} value={type} className="text-xs">
                {type.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground truncate" title={target.title}>
          {target.title}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => onRemove(link.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function TaskLinks({ task, workspaceId, projectId }: any) {
  const [targetTaskId, setTargetTaskId] = useState("");
  const [linkType, setLinkType] = useState<TaskLinkType>(
    TaskLinkType.RELATES_TO
  );

  const { addLink, removeLink, updateLink, isPending } = useManageTaskLinks(
    workspaceId,
    projectId,
    task.id
  );

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTaskId.trim()) return;
    addLink(
      { targetTaskId, type: linkType },
      { onSuccess: () => setTargetTaskId("") }
    );
  };

  const allLinks = [...(task.links || []), ...(task.linkedToBy || [])];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Linked Tasks</h3>
      <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border p-1">
        {allLinks.length > 0 ? (
          allLinks.map((link: any) => (
            <TaskLinkItem
              key={link.id}
              link={link}
              onRemove={removeLink}
              onUpdateType={updateLink}
            />
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
        <Button type="submit" disabled={isPending}>
          Link
        </Button>
      </form>
    </div>
  );
}
