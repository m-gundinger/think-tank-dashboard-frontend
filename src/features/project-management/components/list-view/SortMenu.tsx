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
    const isCurrentlySorted = currentSort?.id === columnId;
    if (isCurrentlySorted && currentSort.desc) {
      // Third click: remove sort
      setSorting([]);
    } else {
      // First click: sort asc, second click: sort desc
      setSorting([
        { id: columnId, desc: isCurrentlySorted ? !currentSort.desc : false },
      ]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-border bg-element text-foreground hover:bg-hover"
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