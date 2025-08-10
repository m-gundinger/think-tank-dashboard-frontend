import { useState } from "react";
import { TeamCard } from "./TeamCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users } from "lucide-react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { TeamForm } from "./TeamForm";
import { ManageTeamMembers } from "./ManageTeamMembers";
import { useManageTeams } from "../api/useManageTeams";

const TeamListSkeleton = () => (
  <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
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
  const { useGetAll } = useManageTeams(workspaceId);
  const { data, isLoading, isError, error } = useGetAll();
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
      <div className="pt-6">
        <EmptyState
          icon={<Users className="h-10 w-10 text-primary" />}
          title="This workspace has no teams yet."
          description="Create the first team to start organizing users."
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((team) => (
          <TeamCard
            team={{ ...team, workspaceId }}
            key={team.id}
            onEdit={() => setEditingTeamId(team.id)}
          />
        ))}
      </div>
      <ResourceCrudDialog
        resourceId={editingTeamId}
        resourcePath={`workspaces/${workspaceId}/teams`}
        resourceKey={["teams", workspaceId]}
        title="Edit Team"
        description="Update team details and manage its members."
        form={TeamForm}
        formProps={{ workspaceId }}
        isOpen={!!editingTeamId}
        onOpenChange={(isOpen: any) => !isOpen && setEditingTeamId(null)}
        dialogClassName="sm:max-w-3xl"
      >
        {(team: any) => (
          <ManageTeamMembers team={team} workspaceId={workspaceId} />
        )}
      </ResourceCrudDialog>
    </>
  );
}
