// FILE: src/features/admin/users/components/UserList.tsx
import { useState } from "react";
import { useGetUsers } from "../api/useGetUsers";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditUserDialog } from "./EditUserDialog";
import { UserTableRow } from "./UserTableRow";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteUser } from "../api/useDeleteUser";

export function UserList() {
  const [page, setPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { data, isLoading, isError } = useGetUsers({ page, limit: 10 });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const deleteMutation = useDeleteUser();

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(data?.data?.map((user: any) => user.id) || []);
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, id]);
    } else {
      setSelectedUserIds((prev) => prev.filter((prevId) => prevId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(`Deactivate ${selectedUserIds.length} selected users?`)
    ) {
      deleteMutation.mutate(selectedUserIds, {
        onSuccess: () => setSelectedUserIds([]),
      });
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users.</div>;

  const isAllSelected =
    data?.data?.length > 0 && selectedUserIds.length === data.data.length;

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        {selectedUserIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deactivate ({selectedUserIds.length})
          </Button>
        )}
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[50px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.length > 0 ? (
              data.data.map((user: any) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onEdit={() => setEditingUserId(user.id)}
                  isSelected={selectedUserIds.includes(user.id)}
                  onSelect={handleRowSelect}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found.
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

      <EditUserDialog
        userId={editingUserId}
        isOpen={!!editingUserId}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingUserId(null);
          }
        }}
      />
    </>
  );
}
