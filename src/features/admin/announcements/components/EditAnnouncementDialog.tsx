import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnnouncementForm } from "./AnnouncementForm";
import { useGetAnnouncement } from "../api/useGetAnnouncements";
import { Skeleton } from "@/components/ui/skeleton";

interface EditAnnouncementDialogProps {
  announcementId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditAnnouncementDialog({
  announcementId,
  isOpen,
  onOpenChange,
}: EditAnnouncementDialogProps) {
  const { data: announcement, isLoading } = useGetAnnouncement(announcementId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
          <DialogDescription>
            Make changes to the announcement details.
          </DialogDescription>
        </DialogHeader>
        {isLoading && announcementId ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <AnnouncementForm
            initialData={announcement}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
