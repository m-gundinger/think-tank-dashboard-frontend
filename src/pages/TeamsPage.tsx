import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { TeamForm } from "@/features/user-management/components/TeamForm";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { useManageTeams } from "@/features/user-management/api/useManageTeams";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users } from "lucide-react";
import { TeamCard } from "@/features/user-management/components/TeamCard";
import { ManageTeamMembers } from "@/features/user-management/components/ManageTeamMembers";

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

export function TeamsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { useGetAll, resourceUrl, resourceKey } = useManageTeams(workspaceId!);
  const { data, isLoading, isError, error } = useGetAll();
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

  const renderContent = () => {
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
      <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((team) => (
          <TeamCard
            team={{ ...team, workspaceId }}
            key={team.id}
            onEdit={() => setEditingTeamId(team.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <ListPageLayout
      title="All Teams"
      description="Manage teams within your workspace."
      actionButton={
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
          resourcePath={resourceUrl}
          resourceKey={resourceKey}
        />
      }
    >
      {renderContent()}
      <ResourceCrudDialog
        resourceId={editingTeamId}
        resourcePath={resourceUrl}
        resourceKey={resourceKey}
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
    </ListPageLayout>
  );
}
