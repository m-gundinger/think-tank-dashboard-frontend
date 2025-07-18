// FILE: src/features/admin/users/components/EditUserDialog.tsx
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
import { AdminProfileAvatar } from "./AdminProfileAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
      <DialogContent className="flex h-full max-h-[90vh] flex-col sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Modify user details and manage their roles.
          </DialogDescription>
        </DialogHeader>
        {isLoading || !userData ? (
          <div className="p-8 text-center">Loading user data...</div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 gap-8 py-4 pr-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-1">
                <Card>
                  <CardContent className="flex flex-col items-center pt-8">
                    {isLoading || !userData ? (
                      <Skeleton className="h-32 w-32 rounded-full" />
                    ) : (
                      <AdminProfileAvatar user={userData} />
                    )}
                    <h2 className="mt-4 text-2xl font-semibold">
                      {isLoading ? (
                        <Skeleton className="h-8 w-40" />
                      ) : (
                        userData?.name
                      )}
                    </h2>
                    <p className="text-muted-foreground">
                      {isLoading ? (
                        <Skeleton className="h-4 w-48" />
                      ) : (
                        userData?.roles.join(", ")
                      )}
                    </p>
                  </CardContent>
                </Card>
                <ManageUserRoles user={userData} />
              </div>
              <div className="lg:col-span-2">
                <EditUserForm
                  user={userData}
                  onSuccess={() => onOpenChange(false)}
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
