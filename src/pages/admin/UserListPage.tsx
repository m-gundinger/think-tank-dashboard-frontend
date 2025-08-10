import { UserList } from "@/features/admin/users/components/UserList";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateUserForm } from "@/features/admin/users/components/CreateUserForm";
import { ListPageLayout } from "@/components/layout/ListPageLayout";

export function UserListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <ListPageLayout
      title="User Management"
      description="View and manage system users."
      actionButton={
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              New User
            </Button>
          }
          title="Create New User"
          description="Fill out the form below to create a new user account. An invitation email will be sent for them to set their password."
          form={CreateUserForm}
          resourcePath="admin/users"
          resourceKey={["users"]}
        />
      }
    >
      <UserList />
    </ListPageLayout>
  );
}