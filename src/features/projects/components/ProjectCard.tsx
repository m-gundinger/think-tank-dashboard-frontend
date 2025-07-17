// FILE: src/features/projects/components/ProjectCard.tsx
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
import { useDeleteProject } from "../api/useDeleteProject";
import { getIcon } from "@/lib/icons";

interface ProjectCardProps {
  project: any;
  onEdit: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const deleteMutation = useDeleteProject(project.workspaceId);
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the "${project.name}" project? This action is permanent.`
      )
    ) {
      deleteMutation.mutate(project.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(project.id);
  };

  const projectUrl = `/workspaces/${project.workspaceId}/projects/${project.id}`;
  const Icon = getIcon(project.icon);

  return (
    <Link to={projectUrl}>
      <Card className="hover:border-primary flex h-full flex-col transition-colors">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-gray-400" />
            <div className="flex-1">
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
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
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>Status: {project.status}</span>
            <span>
              Created: {new Date(project.createdAt).toLocaleDateString("en-US")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
