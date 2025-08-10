import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { useManageWidgets } from "../api/useManageWidgets";

interface WidgetWrapperProps {
  widget: any;
  workspaceId?: string;
  projectId?: string;
  children: ReactNode;
}

export function WidgetWrapper({ widget, children }: WidgetWrapperProps) {
  const { useDelete } = useManageWidgets(widget.dashboardId);
  const deleteMutation = useDelete();

  const handleDelete = () => {
    if (window.confirm(`Delete widget "${widget.title}"?`)) {
      deleteMutation.mutate(widget.id);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-base">{widget.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-red-500"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
}