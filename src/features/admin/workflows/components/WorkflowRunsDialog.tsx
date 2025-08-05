import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkflowRunList } from "./WorkflowRunList";

interface WorkflowRunsDialogProps {
  workflowId: string | null;
  workflowName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function WorkflowRunsDialog({
  workflowId,
  workflowName,
  isOpen,
  onOpenChange,
}: WorkflowRunsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Run History: {workflowName}</DialogTitle>
          <DialogDescription>
            A log of all executions for this workflow.
          </DialogDescription>
        </DialogHeader>
        {workflowId && <WorkflowRunList workflowId={workflowId} />}
      </DialogContent>
    </Dialog>
  );
}