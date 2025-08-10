import { useState } from "react";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Permission } from "@/types";
import { useManagePermissions } from "../api/useManagePermissions";

export function PermissionList() {
  const [page, setPage] = useState(1);
  const { useGetAll, useDelete } = useManagePermissions();
  const { data, isLoading, isError } = useGetAll({ page });
  const deleteMutation = useDelete();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <span className="font-mono">{row.original.action}</span>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <span className="font-mono">{row.original.subject}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description,
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