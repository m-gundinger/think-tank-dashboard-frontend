import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetUser } from "../api/useGetUser";
import { EditUserForm } from "./EditUserForm";
import { ManageUserRoles } from "./ManageUserRoles";

interface EditUserDialogProps {
  userId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditUserDialog({
  userId,
  isOpen,
  onOpenChange,
}: EditUserDialogProps) {
  const { data: userData, isLoading } = useGetUser(userId!);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Modify user details and manage their roles.
          </DialogDescription>
        </DialogHeader>
        {isLoading || !userData ? (
          <div className="p-8 text-center">Loading user data...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
            <EditUserForm
              user={userData}
              onSuccess={() => onOpenChange(false)}
            />
            <ManageUserRoles user={userData} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
