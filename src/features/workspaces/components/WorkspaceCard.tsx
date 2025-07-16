import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useDeleteWorkspace } from "../api/useDeleteWorkspace";

interface WorkspaceCardProps {
  workspace: any;
  onEdit: (workspaceId: string) => void;
}

export function WorkspaceCard({ workspace, onEdit }: WorkspaceCardProps) {
  const deleteMutation = useDeleteWorkspace();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the "${workspace.name}" workspace? This will delete all associated projects and tasks.`
      )
    ) {
      deleteMutation.mutate(workspace.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(workspace.id);
  };

  return (
    <Link to={`/workspaces/${workspace.id}/projects`} key={workspace.id}>
      <Card className="hover:border-primary flex h-full flex-col transition-colors">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{workspace.name}</CardTitle>
            <CardDescription>{workspace.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow"></CardContent>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Created on: {new Date(workspace.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
