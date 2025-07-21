import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { useRetryJob, useCancelJob } from "../api/useJobActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  RefreshCw,
  XCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { JobStatus } from "@/types";
import { Job } from "@/lib/schemas";

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
  const jobResource = useApiResource("admin/jobs", ["jobs"]);
  const [page] = useState(1);
  const { data, isLoading, isError } = jobResource.useGetAll({
    page,
    limit: 20,
  });
  const retryMutation = useRetryJob();
  const cancelMutation = useCancelJob();

  if (isLoading) return <div>Loading jobs...</div>;
  if (isError) return <div>Error loading jobs.</div>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Attempts</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="w-[50px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.data && data.data.length > 0 ? (
          data.data.map((job: Job) => {
            const StatusIcon = statusIconMap[job.status];
            return (
              <TableRow key={job.id}>
                <TableCell>
                  <Badge variant={statusVariantMap[job.status]}>
                    <StatusIcon className="mr-2 h-4 w-4" />
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{job.type}</TableCell>
                <TableCell>
                  {job.attempts} / {job.maxAttempts}
                </TableCell>
                <TableCell>
                  {new Date(job.createdAt).toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => retryMutation.mutate(job.id)}
                        disabled={
                          job.status === "RUNNING" || job.status === "PENDING"
                        }
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Retry
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => cancelMutation.mutate(job.id)}
                        disabled={
                          job.status !== "RUNNING" && job.status !== "PENDING"
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" /> Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No jobs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
