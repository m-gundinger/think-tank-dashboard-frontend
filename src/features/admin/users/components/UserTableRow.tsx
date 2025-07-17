// FILE: src/features/admin/users/components/UserTableRow.tsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, ShieldAlert } from "lucide-react";
import { useDeleteUser } from "../api/useDeleteUser";
import { useSetUserStatus } from "../api/useSetUserStatus";
import { useHardDeleteUser } from "../api/useHardDeleteUser";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface UserTableRowProps {
  user: any;
  onEdit: (userId: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

export function UserTableRow({
  user,
  onEdit,
  isSelected,
  onSelect,
}: UserTableRowProps) {
  const deleteUserMutation = useDeleteUser();
  const setUserStatusMutation = useSetUserStatus();
  const hardDeleteUserMutation = useHardDeleteUser();

  const handleDelete = (isHard: boolean) => {
    const action = isHard ? "permanently delete" : "soft-delete (deactivate)";
    if (
      window.confirm(`Are you sure you want to ${action} user: ${user.name}?`)
    ) {
      if (isHard) {
        hardDeleteUserMutation.mutate(user.id);
      } else {
        deleteUserMutation.mutate(user.id);
      }
    }
  };
  const handleStatusChange = (isActive: boolean) => {
    setUserStatusMutation.mutate({ userId: user.id, isActive });
  };
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(user.id, !!checked)}
        />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.avatarUrl}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{user.name}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={user.isActive}
            onCheckedChange={handleStatusChange}
            aria-label="User active status"
          />
          <Badge
            variant={user.isActive ? "default" : "destructive"}
            className={cn(
              "pointer-events-none",
              user.isActive ? "bg-green-500" : ""
            )}
          >
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="max-w-xs space-x-1 truncate">
        {user.roles.map((role: string) => (
          <Badge key={role} variant="secondary">
            {role}
          </Badge>
        ))}
      </TableCell>
      <TableCell>
        {new Date(user.createdAt).toLocaleDateString("en-US")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(user.id)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit User & Roles</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-amber-600 focus:text-amber-600"
              onClick={() => handleDelete(false)}
              disabled={deleteUserMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Deactivate (Soft Delete)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => handleDelete(true)}
              disabled={hardDeleteUserMutation.isPending}
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              <span>Hard Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
