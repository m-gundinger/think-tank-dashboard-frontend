import { useApiResource } from "@/hooks/useApiResource";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useState } from "react";
interface ManageUserRolesProps {
  user: any;
}

export function ManageUserRoles({ user }: ManageUserRolesProps) {
  const roleResource = useApiResource("admin/roles", ["roles"]);
  const [selectedRole, setSelectedRole] = useState("");
  const { data: rolesData, isLoading: isLoadingRoles } =
    roleResource.useGetAll();

  const assignRoleMutation = useApiMutation({
    mutationFn: (roleId: string) =>
      api.post(`admin/users/${user.id}/roles`, { roleId }),
    successMessage: "Role assigned successfully.",
    invalidateQueries: [["users"], ["user", user.id]],
  });

  const removeRoleMutation = useApiMutation({
    mutationFn: (roleId: string) =>
      api.delete(`admin/users/${user.id}/roles/${roleId}`),
    successMessage: "Role removed successfully.",
    invalidateQueries: [["users"], ["user", user.id]],
  });

  const availableRoles =
    rolesData?.data.filter((role: any) => !user.roles.includes(role.name)) ||
    [];
  const handleAssignRole = () => {
    if (selectedRole) {
      assignRoleMutation.mutate(selectedRole, {
        onSuccess: () => setSelectedRole(""),
      });
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h4 className="font-semibold">User Roles</h4>
      <div className="flex flex-wrap gap-2">
        {user.roles.length > 0 ? (
          user.roles.map((roleName: string) => (
            <Badge key={roleName} variant="secondary" className="pr-1">
              <span>{roleName}</span>
              <Button
                size="icon"
                variant="ghost"
                className="ml-1 h-4 w-4"
                onClick={() => {
                  const role = rolesData?.data.find(
                    (r: any) => r.name === roleName
                  );
                  if (role) removeRoleMutation.mutate(role.id);
                }}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No roles assigned.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
          disabled={availableRoles.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role to add" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingRoles ? (
              <SelectItem value="loading" disabled>
                Loading roles...
              </SelectItem>
            ) : (
              availableRoles.map((role: any) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAssignRole}
          disabled={!selectedRole || assignRoleMutation.isPending}
          size="sm"
        >
          {assignRoleMutation.isPending ? "Adding..." : "Add Role"}
        </Button>
      </div>
    </div>
  );
}