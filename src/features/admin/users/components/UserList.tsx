import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/ui/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, ShieldAlert } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSetUserStatus } from "../api/useSetUserStatus";
import { useHardDeleteUser } from "../api/useHardDeleteUser";
import { cn, getAbsoluteUrl } from "@/lib/utils";
import { UserForm } from "./UserForm";
import { ManageUserRoles } from "./ManageUserRoles";
import { ProfileAvatar } from "@/features/profile/components/ProfileAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types";

const UserActionsCell = ({
  user,
  onEdit,
}: {
  user: User;
  onEdit: (id: string) => void;
}) => {
  const userResource = useApiResource("admin/users", ["users"]);
  const deleteUserMutation = userResource.useDelete();
  const hardDeleteUserMutation = useHardDeleteUser();

  const handleDelete = (isHard: boolean) => {
    const action = isHard ? "permanently delete" : "deactivate";
    if (
      window.confirm(`Are you sure you want to ${action} user: ${user.name}?`)
    ) {
      if (isHard) {
        hardDeleteUserMutation.mutate(user.id);
      } else {
        deleteUserMutation.mutate(user.id);
      }
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(user.id)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit User & Roles</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-amber-600 focus:text-amber-600"
          onClick={() => handleDelete(false)}
          disabled={deleteUserMutation.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Deactivate (Soft Delete)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => handleDelete(true)}
          disabled={hardDeleteUserMutation.isPending}
        >
          <ShieldAlert className="mr-2 h-4 w-4" />
          <span>Hard Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function UserList() {
  const [, setPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const userResource = useApiResource<User>("admin/users", ["users"]);
  const deleteMutation = userResource.useDelete();
  const setUserStatusMutation = useSetUserStatus();
  const { data, isLoading, isError } = userResource.useGetAll();

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (row: User) => {
        const user = row;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={getAbsoluteUrl(user.avatarUrl)}
                alt={user.name}
              />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{user.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (row: User) => row.email,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (row: User) => {
        const user = row;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={user.isActive}
              onCheckedChange={(isActive) =>
                setUserStatusMutation.mutate({ userId: user.id, isActive })
              }
            />
            <Badge
              variant={user.isActive ? "default" : "destructive"}
              className={cn(user.isActive ? "bg-green-500" : "")}
            >
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: (row: User) => {
        const user = row;
        return (
          <div className="flex flex-wrap gap-1">
            {user.roles.map((role: string) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (row: User) => new Date(row.createdAt).toLocaleDateString("en-US"),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: User) => (
        <UserActionsCell user={row} onEdit={setEditingUserId} />
      ),
    },
  ];

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users.</div>;
  return (
    <>
      <DataTableWrapper>
        <DataTable
          columns={columns}
          data={data?.data || []}
          pagination={{
            page: data?.page || 1,
            totalPages: data?.totalPages || 1,
            handlePageChange,
          }}
          bulkActions={(selectedIds) => (
            <Button
              variant="destructive"
              onClick={() => {
                if (
                  window.confirm(
                    `Deactivate ${selectedIds.length} selected users?`
                  )
                ) {
                  deleteMutation.mutate(selectedIds);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Deactivate ({selectedIds.length})
            </Button>
          )}
        />
      </DataTableWrapper>

      <ResourceCrudDialog
        resourceId={editingUserId}
        resourcePath="admin/users"
        resourceKey={["users"]}
        title="Edit User Profile"
        description="Modify user details and manage their roles."
        form={UserForm}
        formProps={{ isSelfProfile: false }}
        isOpen={!!editingUserId}
        onOpenChange={(isOpen) => !isOpen && setEditingUserId(null)}
        dialogClassName="flex h-full max-h-[90vh] flex-col sm:max-w-5xl"
      >
        {(user) => (
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardContent className="flex flex-col items-center pt-8">
                <ProfileAvatar user={user} isSelfProfile={false} />
                <h2 className="mt-4 text-2xl font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground">
                  {user?.roles.join(", ")}
                </p>
              </CardContent>
            </Card>
            <ManageUserRoles user={user} />
          </div>
        )}
      </ResourceCrudDialog>
    </>
  );
}