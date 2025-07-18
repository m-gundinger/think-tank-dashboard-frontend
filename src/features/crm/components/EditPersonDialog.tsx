// FILE: src/features/crm/components/EditPersonDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PersonForm } from "./PersonForm";
import { Skeleton } from "@/components/ui/skeleton";

interface EditPersonDialogProps {
  person: any | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditPersonDialog({
  person,
  isOpen,
  onOpenChange,
}: EditPersonDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
          <DialogDescription>
            Make changes to the person's details.
          </DialogDescription>
        </DialogHeader>
        {person ? (
          <PersonForm
            initialData={person}
            onSuccess={() => onOpenChange(false)}
          />
        ) : (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
