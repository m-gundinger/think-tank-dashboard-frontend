
import { useGetWorkloadReport } from "../api/useGetWorkloadReport";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAbsoluteUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkloadView({ workspaceId }: { workspaceId: string }) {
  const { data, isLoading, isError } = useGetWorkloadReport(workspaceId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (isError) return <div>Error loading workload data.</div>;

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Member</TableHead>
              <TableHead className="text-center">Open Tasks</TableHead>
              <TableHead className="text-center">Story Points</TableHead>
              <TableHead className="text-center">Time Estimate (Hours)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((member: any) => (
              <TableRow key={member.userId}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={getAbsoluteUrl(member.avatarUrl)} alt={member.name} />
                      <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{member.taskCount}</TableCell>
                <TableCell className="text-center">{member.storyPoints ?? 0}</TableCell>
                <TableCell className="text-center">
                  {((member.timeEstimate ?? 0) / 60).toFixed(1)}h
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}