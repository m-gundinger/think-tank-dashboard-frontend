import { useRetryJob, useCancelJob } from "../api/useJobActions";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  XCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { JobStatus } from "@/types/api";
import { Job } from "@/types";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/ui/DataTable";
import { ActionMenu, CustomAction } from "@/components/ui/ActionMenu";
import { useManageJobs } from "../api/useManageJobs";

const statusVariantMap: Record<
  JobStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [JobStatus.PENDING]: "outline",
  [JobStatus.RUNNING]: "default",
  [JobStatus.COMPLETED]: "secondary",
  [JobStatus.FAILED]: "destructive",
  [JobStatus.CANCELLED]: "destructive",
};

const statusIconMap: Record<JobStatus, React.ElementType> = {
  [JobStatus.PENDING]: Clock,
  [JobStatus.RUNNING]: RefreshCw,
  [JobStatus.COMPLETED]: CheckCircle,
  [JobStatus.FAILED]: AlertCircle,
  [JobStatus.CANCELLED]: XCircle,
};

export function JobList() {
  const { useGetAll, useDelete } = useManageJobs();
  const { data, isLoading, isError } = useGetAll();
  const retryMutation = useRetryJob();
  const cancelMutation = useCancelJob();
  const deleteMutation = useDelete();

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const StatusIcon = statusIconMap[status];
        return (
          <Badge variant={statusVariantMap[status]}>
            <StatusIcon className="mr-2 h-4 w-4" />
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.type}</span>
      ),
    },
    {
      accessorKey: "attempts",
      header: "Attempts",
      cell: ({ row }) =>
        `${row.original.attempts} / ${row.original.maxAttempts}`,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString("en-US"),
    },
  ];

  if (isLoading) return <div>Loading jobs...</div>;
  if (isError) return <div>Error loading jobs.</div>;
  return (
    <DataTableWrapper>
      <DataTable
        columns={columns}
        data={data?.data || []}
        renderRowActions={(job) => {
          const customActions: CustomAction[] = [
            {
              label: "Retry",
              icon: RefreshCw,
              onClick: () => retryMutation.mutate(job.id),
              disabled: job.status === "RUNNING" || job.status === "PENDING",
            },
            {
              label: "Cancel",
              icon: XCircle,
              onClick: () => cancelMutation.mutate(job.id),
              disabled: job.status !== "RUNNING" && job.status !== "PENDING",
              className: "text-red-600 focus:text-red-600",
            },
          ];
          return (
            <ActionMenu
              customActions={customActions}
              onDelete={() => deleteMutation.mutate(job.id)}
            />
          );
        }}
      />
    </DataTableWrapper>
  );
}
