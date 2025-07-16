import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreatePublicationForm } from "./CreatePublicationForm";

interface EditDialogProps {
  publication: any | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditPublicationDialog({
  publication,
  isOpen,
  onOpenChange,
}: EditDialogProps) {
  if (!publication) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Publication</DialogTitle>
          <DialogDescription>
            Make changes to the publication details.
          </DialogDescription>
        </DialogHeader>
        <CreatePublicationForm
          initialData={publication}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
