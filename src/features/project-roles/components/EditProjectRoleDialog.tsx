import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetPermissions } from "@/features/admin/permissions/api/useGetPermissions";
import { useAssignPermissionToProjectRole } from "../api/useAssignPermissionToProjectRole";
import { useRevokePermissionFromProjectRole } from "../api/useRevokePermissionFromProjectRole";

interface EditProjectRoleDialogProps {
  role: any | null;
  workspaceId: string;
  projectId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditProjectRoleDialog({
  role,
  workspaceId,
  projectId,
  isOpen,
  onOpenChange,
}: EditProjectRoleDialogProps) {
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    useGetPermissions({ limit: 100 });
  const assignMutation = useAssignPermissionToProjectRole(
    workspaceId,
    projectId,
    role?.id
  );
  const revokeMutation = useRevokePermissionFromProjectRole(
    workspaceId,
    projectId,
    role?.id
  );
  if (!isOpen || !role) return null;

  const rolePermissionIds = new Set(role.permissions.map((p: any) => p.id));
  const handlePermissionToggle = (permissionId: string, isChecked: boolean) => {
    if (isChecked) {
      assignMutation.mutate(permissionId);
    } else {
      revokeMutation.mutate(permissionId);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Role: {role.name}</DialogTitle>
          <DialogDescription>
            Manage the permissions assigned to this project-specific role.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="font-semibold">Permissions</h4>
          {isLoadingPermissions ? (
            <p>Loading permissions...</p>
          ) : (
            <div className="grid h-96 overflow-y-auto rounded-md border p-4 sm:grid-cols-2">
              {permissionsData?.data.map((permission: any) => (
                <div key={permission.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`perm-${permission.id}`}
                    checked={rolePermissionIds.has(permission.id)}
                    onCheckedChange={(checked) =>
                      handlePermissionToggle(permission.id, !!checked)
                    }
                  />
                  <label
                    htmlFor={`perm-${permission.id}`}
                    className="text-sm font-medium"
                  >
                    {permission.action} on {permission.subject}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
