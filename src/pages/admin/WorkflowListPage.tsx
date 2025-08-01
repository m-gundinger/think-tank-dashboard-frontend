import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { WorkflowList } from "@/features/admin/workflows/components/WorkflowList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { WorkflowForm } from "@/features/admin/workflows/components/WorkflowForm";

export function WorkflowListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            Automate tasks based on project events.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          }
          title="Create New Workflow"
          description="Configure a trigger and a series of actions to automate your processes."
          form={WorkflowForm}
          resourcePath="admin/workflows"
          resourceKey={["workflows"]}
          dialogClassName="sm:max-w-[600px]"
        />
      </div>
      <WorkflowList />
    </div>
  );
}