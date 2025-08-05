import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useManageTimeLogs } from "../api/useManageTimeLogs";

interface TimeLogItemProps {
  log: any;
  workspaceId: string;
  projectId: string;
  taskId: string;
}

export function TimeLogItem({
  log,
  workspaceId,
  projectId,
  taskId,
}: TimeLogItemProps) {
  const { useDelete } = useManageTimeLogs(workspaceId, projectId, taskId);
  const deleteMutation = useDelete();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this time log?")) {
      deleteMutation.mutate(log.id, {
        onSuccess: () => toast.success("Time log deleted."),
        onError: () => toast.error("Failed to delete time log."),
      });
    }
  };

  return (
    <div className="hover:bg-accent/50 flex items-center justify-between rounded-md p-2 text-sm">
      <div className="flex-grow">
        <span>{log.description || "Time logged"}</span>
        <p className="text-muted-foreground text-xs">
          Logged on: {new Date(log.loggedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{log.duration}m</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="text-destructive h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
