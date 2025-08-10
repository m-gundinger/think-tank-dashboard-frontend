import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Zap } from "lucide-react";
import { JobSchedule } from "@/types";
import { useTriggerJobSchedule } from "../api/useTriggerJobSchedule";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateJobScheduleForm } from "./CreateJobScheduleForm";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/ui/DataTable";
import { ActionMenu, CustomAction } from "@/components/ui/ActionMenu";
import { useManageJobSchedules } from "../api/useManageJobSchedules";

export function JobScheduleList() {
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null
  );
  const { useGetAll, useUpdate, useDelete } = useManageJobSchedules();
  const { data, isLoading, isError } = useGetAll();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();
  const triggerMutation = useTriggerJobSchedule();

  const columns: ColumnDef<JobSchedule>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "cronExpression",
      header: "Cron Expression",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.cronExpression}</span>
      ),
    },
    {
      accessorKey: "jobType",
      header: "Job Type",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.jobType}</span>
      ),
    },
    {
      accessorKey: "nextRunAt",
      header: "Next Run",
      cell: ({ row }) =>
        row.original.nextRunAt
          ? new Date(row.original.nextRunAt).toLocaleString("en-US")
          : "N/A",
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={(isActive) =>
            updateMutation.mutate({ id: row.original.id, data: { isActive } })
          }
        />
      ),
    },
  ];

  if (isLoading) return <div>Loading schedules...</div>;
  if (isError) return <div>Error loading schedules.</div>;

  return (
    <>
      <DataTableWrapper>
        <DataTable
          columns={columns}
          data={data?.data || []}
          renderRowActions={(schedule) => {
            const customActions: CustomAction[] = [
              {
                label: "Trigger Now",
                icon: Zap,
                onClick: () => triggerMutation.mutate(schedule.id),
              },
            ];
            return (
              <ActionMenu
                onEdit={() => setEditingScheduleId(schedule.id)}
                onDelete={() => deleteMutation.mutate(schedule.id)}
                customActions={customActions}
              />
            );
          }}
        />
      </DataTableWrapper>
      <ResourceCrudDialog
        isOpen={!!editingScheduleId}
        onOpenChange={(isOpen) => !isOpen && setEditingScheduleId(null)}
        title="Edit Job Schedule"
        description="Modify the details of the recurring job."
        form={CreateJobScheduleForm}
        resourceId={editingScheduleId}
        resourcePath="admin/jobs/schedules"
        resourceKey={["jobSchedules"]}
      />
    </>
  );
}
