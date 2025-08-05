import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetWorkflowRuns } from "../api/useGetWorkflowRuns";
import { WorkflowRunDetail } from "./WorkflowRunDetail";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkflowRun } from "@/types";
const statusColors: Record<string, string> = {
  SUCCESS: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  RUNNING: "bg-blue-100 text-blue-800",
};
export function WorkflowRunList({ workflowId }: { workflowId: string }) {
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);
  const { data, isLoading, isError } = useGetWorkflowRuns(workflowId, {
    page: 1,
    limit: 50,
  });
  if (isLoading) return <div>Loading run history...</div>;
  if (isError) return <div>Error loading run history.</div>;
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Started At</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  This workflow has not been run yet.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((run: WorkflowRun) => (
                <TableRow key={run.id}>
                  <TableCell>
                    <Badge
                      className={cn(statusColors[run.status])}
                      variant="outline"
                    >
                      {run.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(run.startedAt).toLocaleString("en-US")}
                  </TableCell>
                  <TableCell>
                    {run.completedAt
                      ? new Date(run.completedAt).toLocaleString("en-US")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRun(run)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <WorkflowRunDetail
        isOpen={!!selectedRun}
        run={selectedRun}
        onOpenChange={(isOpen) => !isOpen && setSelectedRun(null)}
      />
    </>
  );
}