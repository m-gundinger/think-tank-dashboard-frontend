import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
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
import { MoreHorizontal, Edit, Trash2, Zap } from "lucide-react";
import { JobSchedule } from "@/types";
import { useTriggerJobSchedule } from "../api/useTriggerJobSchedule";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateJobScheduleForm } from "./CreateJobScheduleForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function JobScheduleList() {
  const [editingSchedule, setEditingSchedule] = useState<JobSchedule | null>(
    null
  );
  const jobScheduleResource = useApiResource<JobSchedule>(
    "admin/jobs/schedules",
    ["jobSchedules"]
  );
  const { data, isLoading, isError } = jobScheduleResource.useGetAll();
  const updateMutation = jobScheduleResource.useUpdate();
  const deleteMutation = jobScheduleResource.useDelete();
  const triggerMutation = useTriggerJobSchedule();

  if (isLoading) return <div>Loading schedules...</div>;
  if (isError) return <div>Error loading schedules.</div>;

  return (
    <>
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
          {data && data.data && data.data.length > 0 ? (
            data.data.map((schedule: JobSchedule) => (
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
                        id: schedule.id,
                        data: { isActive },
                      })
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => triggerMutation.mutate(schedule.id)}
                      >
                        <Zap className="mr-2 h-4 w-4" /> Trigger Now
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setEditingSchedule(schedule)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => deleteMutation.mutate(schedule.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
      <ResourceCrudDialog
        isOpen={!!editingSchedule}
        onOpenChange={(isOpen) => !isOpen && setEditingSchedule(null)}
        title="Edit Job Schedule"
        description="Modify the details of the recurring job."
        form={CreateJobScheduleForm}
        formProps={{
          initialData: editingSchedule,
          onSuccess: () => setEditingSchedule(null),
        }}
        resourceId={editingSchedule?.id}
        resourcePath="admin/jobs/schedules"
        resourceKey={["jobSchedules"]}
      />
    </>
  );
}
