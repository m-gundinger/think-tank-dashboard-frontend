import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetDashboard } from "../api/useGetDashboard";
import { CreateDashboardForm } from "./CreateDashboardForm";
import { Skeleton } from "@/components/ui/skeleton";

interface EditDialogProps {
  workspaceId: string;
  projectId: string;
  dashboardId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditDashboardDialog({
  workspaceId,
  projectId,
  dashboardId,
  isOpen,
  onOpenChange,
}: EditDialogProps) {
  const { data: dashboardData, isLoading } = useGetDashboard(
    workspaceId,
    projectId,
    dashboardId!
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Dashboard</DialogTitle>
          <DialogDescription>
            Make changes to your dashboard here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {isLoading && dashboardId ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-24" />
          </div>
        ) : (
          dashboardData && (
            <CreateDashboardForm
              workspaceId={workspaceId}
              projectId={projectId}
              initialData={dashboardData}
              onSuccess={() => onOpenChange(false)}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
