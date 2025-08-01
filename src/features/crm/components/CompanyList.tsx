import { useManageCompanies } from "../api/useManageCompanies";
import { EmptyState } from "@/components/ui/empty-state";
import { Building2 } from "lucide-react";
import { CompanyCard } from "./CompanyCard";
import { Skeleton } from "@/components/ui/skeleton";

const ListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-36 w-full" />
    ))}
  </div>
);

export function CompanyList({
  onCompanySelect,
}: {
  onCompanySelect: (id: string) => void;
}) {
  const { useGetAll } = useManageCompanies();
  const { data, isLoading } = useGetAll();

  if (isLoading) return <ListSkeleton />;

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="h-10 w-10" />}
        title="No Companies Found"
        description="Get started by creating your first company."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.data.map((company: any) => (
        <CompanyCard
          key={company.id}
          company={company}
          onSelect={() => onCompanySelect(company.id)}
        />
      ))}
    </div>
  );
}