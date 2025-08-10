import { RoleList } from "@/features/admin/roles/components/RoleList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { RoleForm } from "@/features/admin/roles/components/RoleForm";
import { ListPageLayout } from "@/components/shared/ListPageLayout";

export function RoleListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <ListPageLayout
      title="Role Management"
      description="View system roles and their assigned permissions."
      actionButton={
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
          description="Create a new system-wide role. You can assign permissions after creation."
          form={RoleForm}
          resourcePath="admin/roles"
          resourceKey={["roles"]}
        />
      }
    >
      <RoleList />
    </ListPageLayout>
  );
}