import {
  useGetJobSystemStatus,
  useGetQueueStats,
} from "../api/useGetJobSystemStatus";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: React.ReactNode;
  isLoading: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-1/2" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

export function JobSystemStatus() {
  const { data: statusData, isLoading: isLoadingStatus } =
    useGetJobSystemStatus();
  const { data: queueData, isLoading: isLoadingQueue } = useGetQueueStats();

  const processorStatus = statusData?.processor;
  const schedulerStatus = statusData?.scheduler;
  const queueStats = queueData?.totalJobs;

  const isProcessorOk =
    processorStatus &&
    processorStatus.isProcessing &&
    processorStatus.consecutiveFailures < 5;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Processor Status"
        isLoading={isLoadingStatus}
        value={
          <Badge variant={isProcessorOk ? "default" : "destructive"}>
            {isProcessorOk ? "Running" : "Error"}
          </Badge>
        }
      />
      <StatCard
        title="Scheduler Status"
        isLoading={isLoadingStatus}
        value={
          <Badge variant={schedulerStatus?.isRunning ? "default" : "outline"}>
            {schedulerStatus?.isRunning ? "Running" : "Stopped"}
          </Badge>
        }
      />
      <StatCard
        title="Jobs Running"
        isLoading={isLoadingStatus}
        value={processorStatus?.runningJobs ?? "N/A"}
      />
      <StatCard
        title="Jobs Pending"
        isLoading={isLoadingQueue}
        value={queueStats?.pending ?? "N/A"}
      />
    </div>
  );
}