import { useGetMyWhiteboards } from "@/features/views/api/useGetMyWhiteboards";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Clipboard } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-28 w-full" />
    ))}
  </div>
);

export function WhiteboardsPage() {
  const { data, isLoading, isError, error } = useGetMyWhiteboards();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Whiteboards</h1>
        <p className="text-muted-foreground">
          All whiteboards you have access to across all your projects.
        </p>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState
          title="Failed to Load Whiteboards"
          message={
            (error as any)?.response?.data?.message ||
            "There was a problem fetching your whiteboards."
          }
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          icon={<Clipboard className="text-primary h-10 w-10" />}
          title="No Whiteboards Found"
          description="You have not been assigned to any projects with whiteboard views."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((view: any) => (
            <Link
              to={`/workspaces/${view.project.workspaceId}/projects/${view.projectId}?view=${view.id}`}
              key={view.id}
            >
              <Card className="hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>{view.name}</CardTitle>
                  <CardDescription>
                    Project: {view.project.name}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}