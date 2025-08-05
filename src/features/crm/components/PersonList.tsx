import { useState } from "react";
import { useManagePeople } from "../api/useManagePeople";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Contact, Trash2 } from "lucide-react";
import {
  DataTable,
  ColumnDef,
  DataTableWrapper,
} from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAbsoluteUrl } from "@/lib/utils";
import { Person } from "@/types";

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
  const { useGetAll, useBulkDelete } = useManagePeople();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const bulkDeleteMutation = useBulkDelete();
  const { data, isLoading, isError } = useGetAll({
    page,
    search: searchTerm,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const columns: ColumnDef<Person>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (person: Person) => {
        return (
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => onPersonSelect(person.id)}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={getAbsoluteUrl(person.avatarUrl)}
                alt={`${person.firstName} ${person.lastName}`}
                className="h-full w-full object-cover"
              />
              <AvatarFallback>{person.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{`${person.firstName} ${person.lastName}`}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (person: Person) => (
        <div onClick={() => onPersonSelect(person.id)}>{person.email}</div>
      ),
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: (person: Person) => {
        return (
          <div
            className="flex flex-wrap gap-1"
            onClick={() => onPersonSelect(person.id)}
          >
            {person.roles.map((role: string) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        );
      },
    },
  ];

  if (isLoading) return <PersonListSkeleton />;

  if (!isLoading && (!data || data.data.length === 0)) {
    return (
      <EmptyState
        icon={<Contact />}
        title="No People Found"
        description="No one matches your search criteria, or no people have been added yet."
      />
    );
  }

  if (isError) return <div>Error loading people.</div>;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

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
                    `Delete ${selectedIds.length} selected people? This may include users and cannot be undone.`
                  )
                ) {
                  bulkDeleteMutation.mutate({ ids: selectedIds });
                }
              }}
              disabled={bulkDeleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
          )}
        />
      </DataTableWrapper>
    </div>
  );
}