import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetProject } from "../api/useGetProject";
import { EditProjectForm } from "./EditProjectForm";
import { Skeleton } from "@/components/ui/skeleton";

interface EditProjectDialogProps {
  workspaceId: string;
  projectId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditProjectDialog({
  workspaceId,
  projectId,
  isOpen,
  onOpenChange,
}: EditProjectDialogProps) {
  const { data: projectData, isLoading } = useGetProject(
    workspaceId!,
    projectId!
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {isLoading && projectId ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-24" />
          </div>
        ) : (
          projectData && (
            <EditProjectForm
              project={projectData}
              onSuccess={() => onOpenChange(false)}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
