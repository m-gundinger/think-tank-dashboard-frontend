import { useGetTimeLogs } from "../api/useGetTimeLogs";
import { useAddTimeLog } from "../api/useAddTimeLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TimeLogItem } from "./TimeLogItem";
export function TimeLogSection({ workspaceId, projectId, taskId }: any) {
  const { data: timeLogsData, isLoading } = useGetTimeLogs(
    workspaceId,
    projectId,
    taskId
  );
  const addTimeLogMutation = useAddTimeLog(workspaceId, projectId, taskId);

  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const handleAddTimeLog = () => {
    const durationInMinutes = parseInt(duration, 10);
    if (!isNaN(durationInMinutes) && durationInMinutes > 0) {
      addTimeLogMutation.mutate(
        {
          taskId: taskId,
          duration: durationInMinutes,
          description,
          loggedAt: new Date().toISOString(),
        },
        {
          onSuccess: () => {
            setDuration("");
            setDescription("");
          },
        }
      );
    }
  };

  if (isLoading) return <div>Loading time logs...</div>;

  const totalMinutes =
    timeLogsData?.data?.reduce(
      (sum: number, log: any) => sum + log.duration,
      0
    ) || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Time Tracking</h3>
      <div className="text-2xl font-bold">
        {hours}h {minutes}m
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            placeholder="Minutes"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="col-span-1"
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-2"
          />
        </div>
        <Button
          onClick={handleAddTimeLog}
          disabled={addTimeLogMutation.isPending || !duration}
          size="sm"
        >
          {addTimeLogMutation.isPending ? "Logging..." : "Log Time"}
        </Button>
      </div>
      <div className="max-h-32 space-y-1 overflow-y-auto rounded-md border p-1">
        {timeLogsData?.data?.length > 0 ? (
          timeLogsData.data.map((log: any) => (
            <TimeLogItem
              key={log.id}
              log={log}
              workspaceId={workspaceId}
              projectId={projectId}
              taskId={taskId}
            />
          ))
        ) : (
          <p className="text-muted-foreground p-2 text-center text-xs">
            No time logged for this task.
          </p>
        )}
      </div>
    </div>
  );
}