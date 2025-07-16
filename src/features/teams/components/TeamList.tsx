import { useState } from "react";
import { useGetTeams } from "../api/useGetTeams";
import { TeamCard } from "./TeamCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateTeamDialog } from "./CreateTeamDialog";
import { Users } from "lucide-react";
import { EditTeamDialog } from "./EditTeamDialog";

const TeamListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export function TeamList({ workspaceId }: { workspaceId: string }) {
  const { data, isLoading, isError, error } = useGetTeams(workspaceId);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  if (isLoading) {
    return <TeamListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Teams"
        message={
          (error as any)?.response?.data?.message ||
          "There was a problem fetching teams for this workspace."
        }
      />
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<Users className="text-primary h-10 w-10" />}
        title="This workspace has no teams yet."
        description="Create the first team to start organizing users."
        action={<CreateTeamDialog workspaceId={workspaceId} />}
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((team: any) => (
          <TeamCard
            team={team}
            key={team.id}
            onEdit={() => setEditingTeamId(team.id)}
          />
        ))}
      </div>
      <EditTeamDialog
        teamId={editingTeamId}
        workspaceId={workspaceId}
        isOpen={!!editingTeamId}
        onOpenChange={(isOpen) => !isOpen && setEditingTeamId(null)}
      />
    </>
  );
}
