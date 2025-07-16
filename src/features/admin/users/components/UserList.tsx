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

export function UserList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetUsers({ page, limit: 10 });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users.</div>;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
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
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
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
