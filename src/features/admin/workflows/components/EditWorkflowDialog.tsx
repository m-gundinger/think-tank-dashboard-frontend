import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetWorkflow } from "../api/useGetWorkflow";
import { WorkflowForm } from "./WorkflowForm";
import { Skeleton } from "@/components/ui/skeleton";

interface EditWorkflowDialogProps {
  workflowId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditWorkflowDialog({
  workflowId,
  isOpen,
  onOpenChange,
}: EditWorkflowDialogProps) {
  const { data: workflowData, isLoading } = useGetWorkflow(workflowId!);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Workflow</DialogTitle>
          <DialogDescription>
            Modify the workflow's trigger and actions.
          </DialogDescription>
        </DialogHeader>
        {isLoading && workflowId ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          workflowData && (
            <WorkflowForm
              initialData={workflowData}
              onSuccess={() => onOpenChange(false)}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
