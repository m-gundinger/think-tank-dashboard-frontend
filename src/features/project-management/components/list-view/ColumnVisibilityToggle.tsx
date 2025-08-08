import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Columns } from "lucide-react";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface ColumnVisibilityToggleProps {
  columns: Column[];
  onVisibilityChange: (columnId: string, visible: boolean) => void;
}

export function ColumnVisibilityToggle({
  columns,
  onVisibilityChange,
}: ColumnVisibilityToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-border bg-element text-foreground hover:bg-hover"
        >
          <Columns className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.visible}
            onCheckedChange={(checked) =>
              onVisibilityChange(column.id, !!checked)
            }
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}