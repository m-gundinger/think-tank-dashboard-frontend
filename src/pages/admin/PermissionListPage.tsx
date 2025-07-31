import { PermissionList } from "@/features/admin/permissions/components/PermissionList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { PermissionForm } from "@/features/admin/permissions/components/PermissionForm";

export function PermissionListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            System Permissions
          </h1>
          <p className="text-muted-foreground">
            Manage all available permissions in the system.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Permission
            </Button>
          }
          title="Create New Permission"
          description="Define a new action and subject pair for access control."
          form={PermissionForm}
          resourcePath="admin/permissions"
          resourceKey={["permissions"]}
        />
      </div>
      <PermissionList />
    </div>
  );
}