import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/shared/DataTable";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { AnnouncementForm } from "./AnnouncementForm";
import { Announcement } from "@/types";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { useManageAnnouncements } from "../api/useManageAnnouncements";

export function AnnouncementList() {
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { useGetAll, useDelete } = useManageAnnouncements();
  const { data, isLoading, isError } = useGetAll({ page });
  const deleteMutation = useDelete();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.severity}</Badge>
      ),
    },
    {
      accessorKey: "isPinned",
      header: "Pinned",
      cell: ({ row }) => (row.original.isPinned ? "Yes" : "No"),
    },
    {
      accessorKey: "publishedAt",
      header: "Published",
      cell: ({ row }) =>
        row.original.publishedAt
          ? new Date(row.original.publishedAt).toLocaleDateString("en-US")
          : "N/A",
    },
  ];

  if (isLoading) return <div>Loading announcements...</div>;
  if (isError) return <div>Error loading announcements.</div>;
  return (
    <>
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
                    `Delete ${selectedIds.length} selected announcements?`
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
          renderRowActions={(row) => (
            <ActionMenu
              onEdit={() => setEditingId(row.id)}
              onDelete={() => {
                if (window.confirm(`Delete announcement "${row.title}"?`)) {
                  deleteMutation.mutate(row.id);
                }
              }}
              deleteDisabled={deleteMutation.isPending}
            />
          )}
        />
      </DataTableWrapper>

      <ResourceCrudDialog
        isOpen={!!editingId}
        onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
        title="Edit Announcement"
        description="Make changes to the announcement details."
        form={AnnouncementForm}
        resourcePath="announcements"
        resourceKey={["announcements"]}
        resourceId={editingId}
      />
    </>
  );
}