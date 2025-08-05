import { useManageOrganizations } from "../api/useManageOrganizations";
import { EmptyState } from "@/components/ui/empty-state";
import { Building2 } from "lucide-react";
import { OrganizationCard } from "./OrganizationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Organization } from "@/types";

const ListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-36 w-full" />
    ))}
  </div>
);

export function OrganizationList({
  onOrganizationSelect,
}: {
  onOrganizationSelect: (id: string) => void;
}) {
  const { useGetAll } = useManageOrganizations();
  const { data, isLoading } = useGetAll();

  if (isLoading) return <ListSkeleton />;

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="h-10 w-10" />}
        title="No Organizations Found"
        description="Get started by creating your first organization."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.data.map((organization: Organization) => (
        <OrganizationCard
          key={organization.id}
          organization={organization}
          onSelect={() => onOrganizationSelect(organization.id)}
        />
      ))}
    </div>
  );
}