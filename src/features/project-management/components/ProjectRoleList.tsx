import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditProjectRoleDialog } from "./EditProjectRoleDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";

interface Props {
  workspaceId: string;
  projectId: string;
}

export function ProjectRoleList({ workspaceId, projectId }: Props) {
  const projectRoleResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/roles`,
    ["projectRoles", projectId]
  );
  const { data: rolesData, isLoading } = projectRoleResource.useGetAll();
  const deleteMutation = projectRoleResource.useDelete();
  const [editingRole, setEditingRole] = useState<any | null>(null);
  if (isLoading) return <div>Loading Project Roles...</div>;

  const handleDelete = (role: any) => {
    if (
      window.confirm(
        `Delete project role "${role.name}"? This cannot be undone.`
      )
    ) {
      deleteMutation.mutate(role.id);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {rolesData?.data.map((role: any) => (
          <Card key={role.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{role.name}</CardTitle>
              <ActionMenu
                onEdit={() => setEditingRole(role)}
                onDelete={() => handleDelete(role)}
                deleteDisabled={deleteMutation.isPending}
              />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {role.permissions?.length > 0 ? (
                  role.permissions.map((p: any) => (
                    <Badge variant="secondary" key={p.id}>
                      {p.action} on {p.subject}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No permissions assigned.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <EditProjectRoleDialog
        role={editingRole}
        workspaceId={workspaceId}
        projectId={projectId}
        isOpen={!!editingRole}
        onOpenChange={(isOpen) => !isOpen && setEditingRole(null)}
      />
    </>
  );
}