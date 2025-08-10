import { useState, ReactNode } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  Row,
  SortingState,
  getSortedRowModel,
  OnChangeFn,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type { ColumnDef, SortingState, OnChangeFn };

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: {
    page: number;
    totalPages: number;
    handlePageChange: (newPage: number) => void;
  };
  bulkActions?: (selectedIds: string[]) => ReactNode;
  onRowClick?: (row: TData) => void;
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
  renderRowActions?: (row: TData) => ReactNode;
}

export function DataTable<TData extends { id: string }>({
  columns,
  data,
  pagination,
  bulkActions,
  onRowClick,
  sorting = [],
  setSorting,
  renderRowActions,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});

  const tableColumns: ColumnDef<TData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...columns,
  ];

  if (renderRowActions) {
    tableColumns.push({
      id: "actions",
      cell: ({ row }) => renderRowActions(row.original),
    });
  }

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      rowSelection,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    enableRowSelection: true,
  });

  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row: Row<TData>) => row.original.id);

  return (
    <div className="space-y-4">
      {bulkActions && selectedIds.length > 0 && (
        <div className="flex items-center gap-2">
          {bulkActions(selectedIds)}
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex cursor-pointer select-none items-center"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUpDown className="ml-2 h-4 w-4" />,
                          desc: <ArrowUpDown className="ml-2 h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={onRowClick ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {pagination && pagination.totalPages > 1 && (
          <CardFooter className="flex justify-center pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.page > 1) {
                        pagination.handlePageChange(pagination.page - 1);
                      }
                    }}
                    className={
                      pagination.page <= 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {[...Array(pagination.totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        pagination.handlePageChange(i + 1);
                      }}
                      isActive={pagination.page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.page < pagination.totalPages) {
                        pagination.handlePageChange(pagination.page + 1);
                      }
                    }}
                    className={
                      pagination.page >= pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export function DataTableWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}