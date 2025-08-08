import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ArrowUp, ArrowDown } from "lucide-react";
import { OnChangeFn, SortingState } from "@tanstack/react-table";

interface SortMenuProps {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  sortableColumns: { id: string; label: string }[];
}

export function SortMenu({
  sorting,
  setSorting,
  sortableColumns,
}: SortMenuProps) {
  const currentSort = sorting[0];

  const handleSort = (columnId: string) => {
    const isDesc = currentSort?.id === columnId && currentSort.desc;
    setSorting(isDesc ? [] : [{ id: columnId, desc: !isDesc }]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-hover border-border bg-element text-foreground"
        >
          <ArrowDownUp className="mr-2 h-4 w-4" />
          <span>Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sortableColumns.map((col) => (
          <DropdownMenuItem key={col.id} onClick={() => handleSort(col.id)}>
            {currentSort?.id === col.id ? (
              currentSort.desc ? (
                <ArrowDown className="mr-2 h-4 w-4" />
              ) : (
                <ArrowUp className="mr-2 h-4 w-4" />
              )
            ) : (
              <div className="w-6" />
            )}
            {col.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
