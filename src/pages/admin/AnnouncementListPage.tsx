import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { AnnouncementForm } from "@/features/admin/announcements/components/AnnouncementForm";
import { useManageAnnouncements } from "@/features/admin/announcements/api/useManageAnnouncements";
import { Announcement } from "@/types";
import {
  DataTable,
  ColumnDef,
  DataTableWrapper,
} from "@/components/shared/DataTable";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { BroadcastNotificationDialog } from "@/features/system/components/BroadcastNotificationDialog";

export function AnnouncementListPage() {
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { useGetAll, useDelete } = useManageAnnouncements();
  const { data, isLoading, isError } = useGetAll({ page });
  const deleteMutation = useDelete();

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

  return (
    <ListPageLayout
      title="System Communications"
      description="Create and manage announcements or send real-time broadcasts."
      actionButton={
        <div className="flex items-center gap-2">
          <BroadcastNotificationDialog />
          <ResourceCrudDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            trigger={
              <Button onClick={() => setIsCreateOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            }
            title="Create New Announcement"
            description="Broadcast information to all users or specific roles."
            form={AnnouncementForm}
            resourcePath="announcements"
            resourceKey={["announcements"]}
          />
        </div>
      }
    >
      {isLoading && <div>Loading announcements...</div>}
      {isError && <div>Error loading announcements.</div>}
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
      )}
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
    </ListPageLayout>
  );
}
