import { useGetReportingData } from "../api/useGetReportingData";
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

interface ReportingOverviewProps {
  scope?: {
    workspaceId?: string;
    projectId?: string;
  };
}

export function ReportingOverview({ scope }: ReportingOverviewProps) {
  const { data, isLoading } = useGetReportingData(scope);

  const getTitle = () => {
    if (scope?.projectId) return "Project Overview";
    if (scope?.workspaceId) return "Workspace Overview";
    return "Global Overview";
  };

  const renderContent = () => {
    if (!data) return null;
    switch (data.__typename) {
      case "GlobalAnalyticsOverview":
        return (
          <>
            <StatCard
              title="Total Workspaces"
              value={data.totalWorkspaces}
              isLoading={isLoading}
            />
            <StatCard
              title="Total Projects"
              value={data.totalProjects}
              isLoading={isLoading}
            />
            <StatCard title="Total Users" value={data.totalUsers} isLoading={isLoading} />
            <StatCard title="Total Tasks" value={data.totalTasks} isLoading={isLoading} />
          </>
        );
      case "WorkspaceAnalyticsOverview":
        return (
          <>
            <StatCard
              title="Total Projects"
              value={data.totalProjects}
              isLoading={isLoading}
            />
            <StatCard
              title="Total Members"
              value={data.totalMembers}
              isLoading={isLoading}
            />
            <StatCard title="Total Tasks" value={data.totalTasks} isLoading={isLoading} />
            <StatCard
              title="Time Logged (Hours)"
              value={(data.totalTimeLoggedSeconds / 3600).toFixed(1)}
              isLoading={isLoading}
            />
          </>
        );
      case "ProjectAnalyticsOverview":
        return (
          <>
            <StatCard title="Total Tasks" value={data.totalTasks} isLoading={isLoading} />
            <StatCard
              title="Total Members"
              value={data.totalMembers}
              isLoading={isLoading}
            />
            <StatCard
              title="Story Points Done"
              value={`${data.storyPointsCompleted} / ${data.totalStoryPoints}`}
              isLoading={isLoading}
            />
            <StatCard
              title="Time Logged (Hours)"
              value={(data.totalTimeLoggedSeconds / 3600).toFixed(1)}
              isLoading={isLoading}
            />
          </>
        );
      default:
        return <p>No data available for this view.</p>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
}