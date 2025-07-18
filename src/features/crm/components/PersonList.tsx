import { useState } from "react";
import { useGetPeople } from "../api/useGetPeople";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { PersonTableRow } from "./PersonTableRow";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Contact, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardFooter } from "@/components/ui/card";
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
import { useDeletePerson } from "../api/useDeletePerson";

interface PersonListProps {
  onPersonSelect: (personId: string) => void;
}

const PersonListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </div>
);
export function PersonList({ onPersonSelect }: PersonListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const deleteMutation = useDeletePerson();

  const { data, isLoading, isError } = useGetPeople({
    search: debouncedSearchTerm,
    page,
    limit: 10,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data?.data?.map((item: any) => item.id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((prevId) => prevId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Delete ${selectedIds.length} selected people? This may include users and cannot be undone.`
      )
    ) {
      deleteMutation.mutate(selectedIds, {
        onSuccess: () => setSelectedIds([]),
      });
    }
  };

  const isAllSelected =
    data?.data?.length > 0 && selectedIds.length === data.data.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selectedIds.length})
          </Button>
        )}
      </div>

      {isLoading && <PersonListSkeleton />}

      {!isLoading && data?.data?.length > 0 && (
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
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((person: any) => (
                <PersonTableRow
                  key={person.id}
                  person={person}
                  onRowClick={() => onPersonSelect(person.id)}
                  isSelected={selectedIds.includes(person.id)}
                  onSelectChange={handleRowSelect}
                />
              ))}
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
                {[...Array(data.totalPages)].map((_, i) => (
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
                    isActive={page < data.totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      )}

      {!isLoading && (!data || data.data.length === 0) && (
        <EmptyState
          icon={<Contact />}
          title="No People Found"
          description="No one matches your search criteria, or no people have been added yet."
        />
      )}

      {isError && <div>Error loading people.</div>}
    </div>
  );
}
