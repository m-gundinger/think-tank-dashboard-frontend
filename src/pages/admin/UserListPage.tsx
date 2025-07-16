import { UserList } from "@/features/admin/users/components/UserList";
import { CreateUserDialog } from "@/features/admin/users/components/CreateUserDialog";

export function UserListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View and manage system users.</p>
        </div>
        <CreateUserDialog />
      </div>
      <UserList />
    </div>
  );
}
