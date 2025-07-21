import { useApiResource } from "@/hooks/useApiResource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, MessageSquarePlus, SquarePlus, Trash2 } from "lucide-react";

const activityIconMap: Record<string, React.ElementType> = {
  TASK_CREATED: SquarePlus,
  TASK_UPDATED: Activity,
  TASK_DELETED: Trash2,
  COMMENT_CREATED: MessageSquarePlus,
  DEFAULT: Activity,
};
function formatActivityDetails(activity: any): string {
  const actorName = activity.actor.name;
  switch (activity.actionType) {
    case "TASK_CREATED":
      return `${actorName} created task "${activity.details.title}"`;
    case "TASK_DELETED":
      return `${actorName} deleted task "${activity.details.title}"`;
    case "COMMENT_CREATED":
      return `${actorName} commented on a task: "${activity.details.content.substring(
        0,
        50
      )}..."`;
    case "TASK_UPDATED":
      return `${actorName} updated task "${activity.details.title}"`;
    default:
      return `${actorName} performed action: ${activity.actionType}`;
  }
}

export function ProjectActivityLog({ workspaceId, projectId }: any) {
  const activityResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/activities`,
    ["activities", projectId]
  );
  const { data, isLoading, isError } = activityResource.useGetAll({
    limit: 50,
  });
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <div>Failed to load project activity.</div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data?.data && data.data.length > 0 ? (
          data.data.map((activity: any) => {
            const Icon =
              activityIconMap[activity.actionType] || activityIconMap.DEFAULT;
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm">{formatActivityDetails(activity)}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(activity.createdAt).toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-center text-sm">
            No activity recorded in this project yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
