import { RoleList } from "@/features/admin/roles/components/RoleList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { RoleForm } from "@/features/admin/roles/components/RoleForm";

export function RoleListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            View, create, and manage system roles and their permissions.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Role
            </Button>
          }
          title="Create New Role"
          description="Define a new global role and assign permissions later."
          form={RoleForm}
          resourcePath="admin/roles"
          resourceKey={["roles"]}
        />
      </div>
      <RoleList />
    </div>
  );
}
