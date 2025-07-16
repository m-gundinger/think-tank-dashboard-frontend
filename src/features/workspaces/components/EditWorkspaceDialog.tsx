import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetWorkspace } from "../api/useGetWorkspace";
import { EditWorkspaceForm } from "./EditWorkspaceForm";
import { Skeleton } from "@/components/ui/skeleton";

interface EditWorkspaceDialogProps {
  workspaceId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditWorkspaceDialog({
  workspaceId,
  isOpen,
  onOpenChange,
}: EditWorkspaceDialogProps) {
  const { data: workspaceData, isLoading } = useGetWorkspace(workspaceId!);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>
            Make changes to your workspace here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {isLoading && workspaceId ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-24" />
          </div>
        ) : (
          workspaceData && (
            <EditWorkspaceForm
              workspace={workspaceData}
              onSuccess={() => onOpenChange(false)}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
