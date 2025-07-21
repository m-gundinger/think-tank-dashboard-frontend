import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/ui/DataTable";

export function PermissionList() {
  const [page, setPage] = useState(1);
  const permissionResource = useApiResource("admin/permissions", [
    "permissions",
  ]);
  const { data, isLoading, isError } = permissionResource.useGetAll({
    page,
    limit: 15,
  });
  const deleteMutation = permissionResource.useDelete();

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "action",
      header: "Action",
      cell: (permission) => (
        <span className="font-mono">{permission.action}</span>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: (permission) => (
        <span className="font-mono">{permission.subject}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (permission) => permission.description,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (permission) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete permission "${permission.action} on ${permission.subject}"?`
                    )
                  ) {
                    deleteMutation.mutate(permission.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading permissions...</div>;
  if (isError) return <div>Error loading permissions.</div>;
  return (
    <DataTableWrapper>
      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={{
          page: data?.page || 1,
          totalPages: data?.totalPages || 1,
          handlePageChange,
        }}
        bulkActions={(selectedIds) => (
          <Button
            variant="destructive"
            onClick={() => {
              if (
                window.confirm(
                  `Delete ${selectedIds.length} selected permissions?`
                )
              ) {
                deleteMutation.mutate(selectedIds, {
                  onSuccess: () => {},
                });
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selectedIds.length})
          </Button>
        )}
      />
    </DataTableWrapper>
  );
}
