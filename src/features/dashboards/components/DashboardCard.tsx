import {
  Card,
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
import { useApiResource } from "@/hooks/useApiResource";

interface DashboardCardProps {
  dashboard: any;
  onEdit: (dashboardId: string) => void;
}

export function DashboardCard({ dashboard, onEdit }: DashboardCardProps) {
  const dashboardResource = useApiResource(
    `/workspaces/${dashboard.workspaceId}/projects/${dashboard.projectId}/dashboards`,
    ["dashboards", dashboard.projectId]
  );
  const deleteMutation = dashboardResource.useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the "${dashboard.name}" dashboard?`
      )
    ) {
      deleteMutation.mutate(dashboard.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(dashboard.id);
  };

  const dashboardUrl = `./${dashboard.id}`;

  return (
    <Link to={dashboardUrl}>
      <Card className="hover:border-primary transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{dashboard.name}</CardTitle>
              <CardDescription>
                {dashboard.description || "No description provided."}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 p-0"
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
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
