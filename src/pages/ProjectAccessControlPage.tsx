import { CreateProjectRoleDialog } from "@/features/project-roles/components/CreateProjectRoleDialog";
import { ProjectRoleList } from "@/features/project-roles/components/ProjectRoleList";
import { InviteProjectMember } from "@/features/projects/components/InviteProjectMember";
import { ProjectMemberList } from "@/features/projects/components/ProjectMemberList";
import { useGetProjectMembers } from "@/features/projects/api/useGetProjectMembers";
import { useParams } from "react-router-dom";

export function ProjectAccessControlPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

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
          <CreateProjectRoleDialog
            workspaceId={workspaceId}
            projectId={projectId}
          />
        </div>
        <ProjectRoleList workspaceId={workspaceId} projectId={projectId} />
      </div>
    </div>
  );
}
