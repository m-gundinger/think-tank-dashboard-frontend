import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { WorkflowList } from "@/features/admin/workflows/components/WorkflowList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { WorkflowForm } from "@/features/admin/workflows/components/WorkflowForm";
import { ListPageLayout } from "@/components/layout/ListPageLayout";

export function WorkflowListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <ListPageLayout
      title="Workflows"
      description="Automate tasks based on project events."
      actionButton={
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      }
    >
      <WorkflowList />
      <ResourceCrudDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create New Workflow"
        description="Configure a trigger and a series of actions to automate your processes."
        form={WorkflowForm}
        resourcePath="admin/workflows"
        resourceKey={["workflows"]}
        dialogClassName="sm:max-w-[600px]"
      />
    </ListPageLayout>
  );
}