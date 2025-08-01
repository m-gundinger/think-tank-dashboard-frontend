import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/ui/DataTable";
import { Permission } from "@/types";

export function PermissionList() {
  const [, setPage] = useState(1);
  const permissionResource = useApiResource<Permission>("admin/permissions", [
    "permissions",
  ]);
  const { data, isLoading, isError } = permissionResource.useGetAll();

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
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
      />
    </DataTableWrapper>
  );
}