import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface EntityCardProps {
  title: string;
  description?: string | null;
  linkTo?: string;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  deleteDisabled?: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
}

export function EntityCard({
  title,
  description,
  linkTo,
  onEdit,
  onDelete,
  deleteDisabled,
  children,
  icon: Icon,
}: EntityCardProps) {
  const CardBody = (
    <Card className="hover:border-primary flex h-full flex-col transition-colors">
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-6 w-6 text-gray-400" />}
          <div className="flex-grow">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
        {(onEdit || onDelete) && (
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
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={onDelete}
                  disabled={deleteDisabled}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      {children}
    </Card>
  );

  return linkTo ? (
    <Link to={linkTo} className="block h-full">
      {CardBody}
    </Link>
  ) : (
    CardBody
  );
}