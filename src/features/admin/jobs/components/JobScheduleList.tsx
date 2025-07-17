// FILE: src/features/admin/jobs/components/JobScheduleList.tsx
import { useState } from "react";
import { useGetJobSchedules } from "../api/useGetJobSchedules";
import {
  useUpdateJobSchedule,
  useDeleteJobSchedule,
} from "../api/useJobScheduleActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
export function JobScheduleList() {
  const [page] = useState(1);
  const { data, isLoading, isError } = useGetJobSchedules({
    page,
    limit: 20,
  });
  const updateMutation = useUpdateJobSchedule();
  const deleteMutation = useDeleteJobSchedule();

  if (isLoading) return <div>Loading schedules...</div>;
  if (isError) return <div>Error loading schedules.</div>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Cron Expression</TableHead>
          <TableHead>Job Type</TableHead>
          <TableHead>Next Run</TableHead>
          <TableHead>Active</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data?.length > 0 ? (
          data.data.map((schedule: any) => (
            <TableRow key={schedule.id}>
              <TableCell className="font-medium">{schedule.name}</TableCell>
              <TableCell className="font-mono text-xs">
                {schedule.cronExpression}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {schedule.jobType}
              </TableCell>
              <TableCell>
                {schedule.nextRunAt
                  ? new Date(schedule.nextRunAt).toLocaleString("en-US")
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Switch
                  checked={schedule.isActive}
                  onCheckedChange={(isActive) =>
                    updateMutation.mutate({
                      scheduleId: schedule.id,
                      data: { isActive },
                    })
                  }
                />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(schedule.id)}
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No job schedules found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
