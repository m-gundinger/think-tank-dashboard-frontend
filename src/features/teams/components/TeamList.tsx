import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { TeamCard } from "./TeamCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Users } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { TeamForm } from "./TeamForm";
import { ManageTeamMembers } from "./ManageTeamMembers";

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
  const teamResource = useApiResource(`/workspaces/${workspaceId}/teams`, [
    "teams",
    workspaceId,
  ]);
  const { data, isLoading, isError, error } = teamResource.useGetAll();
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
        action={
          <ResourceCrudDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            trigger={
              <Button onClick={() => setIsCreateOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Team
              </Button>
            }
            title="Create a new team"
            description="Teams help you group users within a workspace."
            form={TeamForm}
            formProps={{ workspaceId }}
            resourcePath={`/workspaces/${workspaceId}/teams`}
            resourceKey={["teams", workspaceId]}
          />
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((team: any) => (
          <TeamCard
            team={{ ...team, workspaceId }}
            key={team.id}
            onEdit={() => setEditingTeamId(team.id)}
          />
        ))}
      </div>
      <ResourceCrudDialog
        resourceId={editingTeamId}
        resourcePath={`/workspaces/${workspaceId}/teams`}
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
