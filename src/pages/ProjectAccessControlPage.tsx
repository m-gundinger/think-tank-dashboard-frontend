import { ProjectRoleList } from "@/features/project-roles/components/ProjectRoleList";
import { InviteProjectMember } from "@/features/projects/components/InviteProjectMember";
import { ProjectMemberList } from "@/features/projects/components/ProjectMemberList";
import { useGetProjectMembers } from "@/features/projects/api/useGetProjectMembers";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateProjectRoleForm } from "@/features/project-roles/components/CreateProjectRoleForm";

export function ProjectAccessControlPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId || !projectId) return <div>Missing URL parameters.</div>;
  const { data: membersData } = useGetProjectMembers(workspaceId, projectId);
  const existingMemberIds = membersData?.map((m: any) => m.userId) || [];
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Project Members</h2>
            <p className="text-muted-foreground">
              Users who have been granted access to this project.
            </p>
          </div>
        </div>
        <ProjectMemberList workspaceId={workspaceId} projectId={projectId} />
        <InviteProjectMember
          workspaceId={workspaceId}
          projectId={projectId}
          existingMemberIds={existingMemberIds}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Project Roles</h2>
            <p className="text-muted-foreground">
              Custom roles and permissions specific to this project.
            </p>
          </div>
          <ResourceCrudDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            trigger={
              <Button onClick={() => setIsCreateOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project Role
              </Button>
            }
            title="Create New Project Role"
            description="This role will only be available within this project."
            form={CreateProjectRoleForm}
            formProps={{ workspaceId, projectId }}
            resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/roles`}
            resourceKey={["projectRoles", projectId]}
          />
        </div>
        <ProjectRoleList workspaceId={workspaceId} projectId={projectId} />
      </div>
    </div>
  );
}