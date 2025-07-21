import { useState, createContext, useContext, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";

export interface ColumnDef<T> {
  accessorKey: keyof T | string;
  header: string;
  cell: (row: T) => ReactNode;
}

interface DataTableContextType {
  selectedIds: string[];
  toggleRow: (id: string) => void;
  toggleSelectAll: (data: any[]) => void;
  isAllSelected: (data: any[]) => boolean;
}

const DataTableContext = createContext<DataTableContextType | undefined>(
  undefined
);
const useDataTable = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  return context;
};
export const useDataTableRowSelection = (id: string) => {
  const { selectedIds, toggleRow } = useDataTable();
  return {
    isSelected: selectedIds.includes(id),
    onSelectChange: () => toggleRow(id),
  };
};
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: {
    page: number;
    totalPages: number;
    handlePageChange: (newPage: number) => void;
  };
  bulkActions?: (selectedIds: string[]) => ReactNode;
}

function DataTableProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (data: any[]) => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((item) => item.id));
    }
  };
  const isAllSelected = (data: any[]) =>
    data.length > 0 && selectedIds.length === data.length;
  return (
    <DataTableContext.Provider
      value={{ selectedIds, toggleRow, toggleSelectAll, isAllSelected }}
    >
      {children}
    </DataTableContext.Provider>
  );
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  pagination,
  bulkActions,
}: DataTableProps<T>) {
  const { selectedIds, toggleRow, toggleSelectAll, isAllSelected } =
    useDataTable();
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
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected(data)}
                  onCheckedChange={() => toggleSelectAll(data)}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.header}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selectedIds.includes(row.id) && "selected"}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onCheckedChange={() => toggleRow(row.id)}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.header}`}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {pagination && pagination.totalPages > 1 && (
          <CardFooter className="pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.handlePageChange(pagination.page - 1);
                    }}
                    isActive={pagination.page > 1}
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
                      pagination.handlePageChange(pagination.page + 1);
                    }}
                    isActive={pagination.page < pagination.totalPages}
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

export function DataTableWrapper({ children }: { children: ReactNode }) {
  return <DataTableProvider>{children}</DataTableProvider>;
}
