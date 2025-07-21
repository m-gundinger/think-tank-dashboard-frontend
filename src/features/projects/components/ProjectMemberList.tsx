import { useGetProjectMembers } from "../api/useGetProjectMembers";
import { useApiResource } from "@/hooks/useApiResource";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { getAbsoluteUrl } from "@/lib/utils";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";

interface ProjectMemberListProps {
  workspaceId: string;
  projectId: string;
}

export function ProjectMemberList({
  workspaceId,
  projectId,
}: ProjectMemberListProps) {
  const { data: membersData, isLoading: isLoadingMembers } =
    useGetProjectMembers(workspaceId, projectId);
  const projectRoleResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/roles`,
    ["projectRoles", projectId]
  );
  const { data: rolesData, isLoading: isLoadingRoles } =
    projectRoleResource.useGetAll();

  const invalidateQueries = [["projectMembers", projectId]];

  const removeMemberMutation = useApiMutation<void, string>({
    mutationFn: async (userId) => {
      await api.delete(
        `/workspaces/${workspaceId}/projects/${projectId}/members/${userId}`
      );
    },
    successMessage: "Member removed from project.",
    invalidateQueries,
  });

  const updateMemberMutation = useApiMutation<
    any,
    { userId: string; roleId: string }
  >({
    mutationFn: async ({ userId, roleId }) => {
      const { data } = await api.patch(
        `/workspaces/${workspaceId}/projects/${projectId}/members/${userId}`,
        { roleId }
      );
      return data;
    },
    successMessage: "Project member's role has been updated.",
    invalidateQueries,
  });

  const handleDelete = (member: any) => {
    if (window.confirm(`Remove ${member.name} from this project?`)) {
      removeMemberMutation.mutate(member.userId);
    }
  };

  const handleRoleChange = (userId: string, roleId: string) => {
    updateMemberMutation.mutate({ userId, roleId });
  };

  if (isLoadingMembers || isLoadingRoles) return <div>Loading members...</div>;

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membersData?.length > 0 ? (
            membersData.map((member: any) => (
              <TableRow key={member.userId}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={getAbsoluteUrl(member.avatarUrl)}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                      <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={member.roleId}
                    onValueChange={(newRoleId) =>
                      handleRoleChange(member.userId, newRoleId)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesData?.data.map((role: any) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(member)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove from Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No members have been added to this project yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
