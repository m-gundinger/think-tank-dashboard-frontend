import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { useState } from "react";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Permission } from "@/types";
import { useManagePermissions } from "@/features/admin/permissions/api/useManagePermissions";

export function PermissionListPage() {
  const [page, setPage] = useState(1);
  const { useGetAll, useDelete } = useManagePermissions();
  const { data, isLoading, isError } = useGetAll({ page });
  const deleteMutation = useDelete();

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

  return (
    <ListPageLayout
      title="System Permissions"
      description="A read-only list of all available permissions in the system."
    >
      {isLoading && <div>Loading permissions...</div>}
      {isError && <div>Error loading permissions.</div>}
      {data && (
        <DataTableWrapper>
          <DataTable
            columns={columns}
            data={data.data || []}
            pagination={{
              page: data.page || 1,
              totalPages: data.totalPages || 1,
              handlePageChange: (newPage) => setPage(newPage),
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
      )}
    </ListPageLayout>
  );
}
