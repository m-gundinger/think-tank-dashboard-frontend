import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { EditProjectRoleDialog } from "./EditProjectRoleDialog";

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
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingRole(role)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Manage Permissions
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(role)}
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </div>
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
                  <span className="text-muted-foreground text-sm">
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