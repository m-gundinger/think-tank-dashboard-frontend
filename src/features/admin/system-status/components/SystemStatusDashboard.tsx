import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSystemStatus } from "../api/useGetSystemStatus";

const StatusBadge = ({
  status,
}: {
  status: "ok" | "partial_outage" | "major_outage" | string;
}) => {
  const variant =
    status === "ok"
      ? "default"
      : status === "partial_outage"
        ? "secondary"
        : "destructive";
  return <Badge variant={variant}>{status}</Badge>;
};

export function SystemStatusDashboard() {
  const { data, isLoading, isError, error } = useGetSystemStatus();
  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError) {
    return (
      <div className="text-destructive">
        Failed to load system status: {error.message}
      </div>
    );
  }

  const { status, timestamp, version, metrics, dependencies } = data;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Status</span>
            <StatusBadge status={status} />
          </CardTitle>
          <CardDescription>
            Last checked: {new Date(timestamp).toLocaleString("en-US")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div>
            <strong>Version:</strong> {version.release}
          </div>
          <div>
            <strong>Commit:</strong> {version.commit.substring(0, 7)}
          </div>
          <div>
            <strong>Uptime:</strong> {metrics.uptime}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dependencies</CardTitle>
          <CardDescription>
            Status of core application dependencies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(dependencies).map(
                ([name, depStatus]: [string, any]) => (
                  <TableRow key={name}>
                    <TableCell className="font-medium capitalize">
                      {name}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={depStatus.status} />
                    </TableCell>
                    <TableCell>{depStatus.responseTime}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {depStatus.message || "OK"}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}