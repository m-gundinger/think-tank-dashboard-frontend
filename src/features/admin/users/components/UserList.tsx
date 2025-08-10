import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { Button } from "@/components/ui/button";
import { Trash2, ShieldAlert } from "lucide-react";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/ui/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSetUserStatus } from "../api/useSetUserStatus";
import { useHardDeleteUser } from "../api/useHardDeleteUser";
import { cn, getAbsoluteUrl } from "@/lib/utils";
import { UserForm } from "./UserForm";
import { ManageUserRoles } from "./ManageUserRoles";
import { ProfileAvatar } from "@/features/user-management/components/ProfileAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { useManageUsers } from "../api/useManageUsers";

export function UserList() {
  const [page, setPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const { useGetAll, useDelete } = useManageUsers();
  const deleteUserMutation = useDelete();
  const hardDeleteUserMutation = useHardDeleteUser();
  const setUserStatusMutation = useSetUserStatus();
  const { data, isLoading, isError } = useGetAll({ page });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
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
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
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
      cell: ({ row }) => {
        const user = row.original;
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
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-US"),
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
                  deleteUserMutation.mutate(selectedIds);
                }
              }}
              disabled={deleteUserMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Deactivate ({selectedIds.length})
            </Button>
          )}
          onRowClick={(row) => setEditingUserId(row.id)}
          renderRowActions={(row) => (
            <ActionMenu
              onEdit={() => setEditingUserId(row.id)}
              customActions={[
                {
                  label: "Deactivate (Soft Delete)",
                  icon: Trash2,
                  className: "text-amber-600 focus:text-amber-600",
                  onClick: () => {
                    if (
                      window.confirm(
                        `Are you sure you want to deactivate user: ${row.name}?`
                      )
                    ) {
                      deleteUserMutation.mutate(row.id);
                    }
                  },
                  disabled: deleteUserMutation.isPending,
                },
                {
                  label: "Hard Delete",
                  icon: ShieldAlert,
                  className: "text-red-600 focus:text-red-600",
                  onClick: () => {
                    if (
                      window.confirm(
                        `Are you sure you want to PERMANENTLY DELETE user: ${row.name}? This action cannot be undone.`
                      )
                    ) {
                      hardDeleteUserMutation.mutate(row.id);
                    }
                  },
                  disabled: hardDeleteUserMutation.isPending,
                },
              ]}
            />
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
        dialogClassName="sm:max-w-4xl"
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
