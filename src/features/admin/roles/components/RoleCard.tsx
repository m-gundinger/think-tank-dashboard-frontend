import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useDeleteRole } from "../api/useDeleteRole";

interface RoleCardProps {
  role: any;
  onEdit: (roleId: string) => void;
}

export function RoleCard({ role, onEdit }: RoleCardProps) {
  const deleteMutation = useDeleteRole();

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${role.name}" role? This action cannot be undone.`
      )
    ) {
      deleteMutation.mutate(role.id);
    }
  };

  return (
    <Card key={role.id}>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{role.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(role.id)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-sm">
          {role.description || "No description."}
        </p>
        <div className="flex flex-wrap gap-1">
          <span className="text-sm font-semibold">Permissions:</span>
          {role.permissions?.length > 0 ? (
            role.permissions.map((p: any) => (
              <Badge variant="outline" key={p.id}>
                {p.action} on {p.subject}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">None</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
