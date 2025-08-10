import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { GlobalTaskTypeList } from "@/features/project-management/components/GlobalTaskTypeList";
import { GlobalTaskTypeForm } from "@/features/project-management/components/GlobalTaskTypeForm";

export function TaskTypesSettingsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Global Task Types</h2>
          <p className="text-muted-foreground">
            Manage task types available for standalone tasks (not in a project).
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Type
            </Button>
          }
          title="Create New Global Task Type"
          description="This type will be available for all of your tasks that are not part of a project."
          form={GlobalTaskTypeForm}
          resourcePath={`task-types`}
          resourceKey={["taskTypes", "global"]}
        />
      </div>
      <GlobalTaskTypeList />
    </div>
  );
}