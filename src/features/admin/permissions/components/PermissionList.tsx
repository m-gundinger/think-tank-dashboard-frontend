import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Permission } from "@/types";

interface PermissionQuery {
  page?: number;
}

export function PermissionList() {
  const [page, setPage] = useState(1);
  const permissionResource = useApiResource<Permission, PermissionQuery>(
    "admin/permissions",
    ["permissions"]
  );
  const { data, isLoading, isError } = permissionResource.useGetAll({ page });
  const deleteMutation = permissionResource.useDelete();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "action",
      header: "Action",
      cell: (row: Permission) => (
        <span className="font-mono">{row.action}</span>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: (row: Permission) => (
        <span className="font-mono">{row.subject}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (row: Permission) => row.description,
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
                deleteMutation.mutate(selectedIds);
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