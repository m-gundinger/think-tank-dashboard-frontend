import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
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