import { CreateWorkflowDialog } from "@/features/admin/workflows/components/CreateWorkflowDialog";
import { WorkflowList } from "@/features/admin/workflows/components/WorkflowList";

export function WorkflowListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            Automate tasks based on project events.
          </p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <WorkflowList />
    </div>
  );
}
