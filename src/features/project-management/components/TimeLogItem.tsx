import { useManageTimeLogs } from "../api/useManageTimeLogs";
import { ActionMenu } from "@/components/ui/ActionMenu";

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
      deleteMutation.mutate(log.id);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md py-1 pl-2 pr-1 text-sm hover:bg-hover">
      <div className="flex-grow">
        <span>{log.description || "Time logged"}</span>
        <p className="text-xs text-muted-foreground">
          Logged on: {new Date(log.loggedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{log.duration}m</span>
        <ActionMenu
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
