import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, LucideIcon } from "lucide-react";
import React from "react";

export interface CustomAction {
  label: string;
  icon: LucideIcon;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}

interface ActionMenuProps {
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  deleteDisabled?: boolean;
  customActions?: CustomAction[];
}

export function ActionMenu({
  onEdit,
  onDelete,
  deleteDisabled,
  customActions,
}: ActionMenuProps) {
  const stopPropagation = (
    handler?: (e: React.MouseEvent) => void
  ): ((e: React.MouseEvent) => void) | undefined => {
    if (!handler) return undefined;
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      handler(e);
    };
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {onEdit && (
          <DropdownMenuItem onClick={stopPropagation(onEdit)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}
        {customActions &&
          customActions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={stopPropagation(action.onClick)}
              className={action.className}
              disabled={action.disabled}
            >
              <action.icon className="mr-2 h-4 w-4" />
              <span>{action.label}</span>
            </DropdownMenuItem>
          ))}
        {(onEdit || (customActions && customActions.length > 0)) &&
          onDelete && <DropdownMenuSeparator />}
        {onDelete && (
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={stopPropagation(onDelete)}
            disabled={deleteDisabled}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
