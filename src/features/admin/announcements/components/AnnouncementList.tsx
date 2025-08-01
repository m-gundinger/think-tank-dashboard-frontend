import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  DataTableWrapper,
  ColumnDef,
} from "@/components/ui/DataTable";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { AnnouncementForm } from "./AnnouncementForm";
import { Announcement } from "@/types";

export function AnnouncementList() {
  const [, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const announcementResource = useApiResource<Announcement>("announcements", [
    "announcements",
  ]);
  const { data, isLoading, isError } = announcementResource.useGetAll();
  const deleteMutation = announcementResource.useDelete();

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: (row: Announcement) => (
        <span className="font-medium">{row.title}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (row: Announcement) => (
        <Badge variant="outline">{row.status}</Badge>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: (row: Announcement) => (
        <Badge variant="secondary">{row.severity}</Badge>
      ),
    },
    {
      accessorKey: "isPinned",
      header: "Pinned",
      cell: (row: Announcement) => (row.isPinned ? "Yes" : "No"),
    },
    {
      accessorKey: "publishedAt",
      header: "Published",
      cell: (row: Announcement) =>
        row.publishedAt
          ? new Date(row.publishedAt).toLocaleDateString("en-US")
          : "N/A",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: Announcement) => {
        const announcement = row;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingId(announcement.id)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete announcement "${announcement.title}"?`
                      )
                    ) {
                      deleteMutation.mutate(announcement.id);
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
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
        />
      </DataTableWrapper>

      <ResourceCrudDialog
        isOpen={!!editingId}
        onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
        trigger={<></>}
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