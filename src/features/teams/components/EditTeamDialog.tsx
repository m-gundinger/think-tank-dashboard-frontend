import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetTeam } from "../api/useGetTeams";
import { EditTeamForm } from "./EditTeamForm";
import { ManageTeamMembers } from "./ManageTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";

interface EditTeamDialogProps {
  teamId: string | null;
  workspaceId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditTeamDialog({
  teamId,
  workspaceId,
  isOpen,
  onOpenChange,
}: EditTeamDialogProps) {
  const { data: team, isLoading } = useGetTeam(workspaceId, teamId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Update team details and manage its members.
          </DialogDescription>
        </DialogHeader>
        {isLoading && teamId ? (
          <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : team ? (
          <div className="grid grid-cols-1 gap-8 py-4 md:grid-cols-2">
            <EditTeamForm
              team={team}
              workspaceId={workspaceId}
              onSuccess={() => onOpenChange(false)}
            />
            <ManageTeamMembers team={team} workspaceId={workspaceId} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
