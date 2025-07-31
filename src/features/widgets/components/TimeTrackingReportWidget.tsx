import { useGetWidgetData } from "../api/useGetWidgetData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TimeTrackingReportWidget({
  widget,
  workspaceId,
  projectId,
}: any) {
  const { data, isLoading } = useGetWidgetData(
    workspaceId,
    projectId,
    widget.dashboardId,
    widget.id
  );
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const payload = data?.payload;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead className="text-right">Logged</TableHead>
          <TableHead className="text-right">Estimated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payload?.rows?.map((row: any) => (
          <TableRow key={row.taskId}>
            <TableCell className="max-w-xs truncate font-medium">
              {row.taskTitle}
            </TableCell>
            <TableCell className="text-right">{row.timeLogged}m</TableCell>
            <TableCell className="text-right">{row.timeEstimate}m</TableCell>
          </TableRow>
        ))}
        <TableRow className="font-bold">
          <TableCell>Total</TableCell>
          <TableCell className="text-right">
            {payload?.totals?.timeLogged}m
          </TableCell>
          <TableCell className="text-right">
            {payload?.totals?.timeEstimate}m
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
