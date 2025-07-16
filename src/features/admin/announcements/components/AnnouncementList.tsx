import { useState } from "react";
import { useGetAnnouncements } from "../api/useGetAnnouncements";
import { useDeleteAnnouncement } from "../api/useDeleteAnnouncement";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EditAnnouncementDialog } from "./EditAnnouncementDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function AnnouncementList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAnnouncements({ page, limit: 10 });
  const deleteMutation = useDeleteAnnouncement();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete announcement "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  if (isLoading) return <div>Loading announcements...</div>;
  if (isError) return <div>Error loading announcements.</div>;

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Pinned</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.length > 0 ? (
              data.data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.severity}</Badge>
                  </TableCell>
                  <TableCell>{item.isPinned ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingId(item.id)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(item.id, item.title)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No announcements found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <CardFooter className="pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                  isActive={page > 1}
                />
              </PaginationItem>
              {Array.from({ length: data?.totalPages || 1 }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    isActive={page === i + 1}
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
                    handlePageChange(page + 1);
                  }}
                  isActive={page < (data?.totalPages || 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
      <EditAnnouncementDialog
        announcementId={editingId}
        isOpen={!!editingId}
        onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
      />
    </>
  );
}
