import { UserList } from "@/features/admin/users/components/UserList";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateUserForm } from "@/features/admin/users/components/CreateUserForm";

export function UserListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View and manage system users.</p>
        </div>
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
      </div>
      <UserList />
    </div>
  );
}