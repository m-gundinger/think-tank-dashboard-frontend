import { useState } from "react";
import { useGetPeople } from "../api/useGetPeople";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { PersonTableRow } from "./PersonTableRow";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Contact } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
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
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {isLoading && <PersonListSkeleton />}

      {!isLoading && data?.data?.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
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
                  onSelect={() => onPersonSelect(person.id)}
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
