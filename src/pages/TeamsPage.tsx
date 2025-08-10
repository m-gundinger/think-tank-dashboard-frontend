import { TeamList } from "@/features/user-management/components/TeamList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { TeamForm } from "@/features/user-management/components/TeamForm";
import { ListPageLayout } from "@/components/shared/ListPageLayout";

export function TeamsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

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
          resourcePath={`workspaces/${workspaceId}/teams`}
          resourceKey={["teams", workspaceId]}
        />
      }
    >
      <TeamList workspaceId={workspaceId} />
    </ListPageLayout>
  );
}