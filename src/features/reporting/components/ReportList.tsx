import { useState } from "react";
import { useManageReports } from "../api/useManageReports";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EntityCard } from "@/components/ui/EntityCard";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { ReportForm } from "./ReportForm";

const ListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-36 w-full" />
    ))}
  </div>
);

export function ReportList() {
  const { useGetAll } = useManageReports();
  const { data, isLoading, isError } = useGetAll({
    sortBy: "title",
    sortOrder: "asc",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) return <ListSkeleton />;
  if (isError) return <div>Error loading reports.</div>;

  const reports = data?.data || [];

  if (reports.length === 0) {
    return (
      <EmptyState
        icon={<BarChart className="h-10 w-10" />}
        title="No Reports Found"
        description="Get started by creating your first report."
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report: any) => (
          <EntityCard
            key={report.id}
            title={report.title}
            description="Custom report"
            icon={BarChart}
          >
            <></>
          </EntityCard>
        ))}
      </div>
      <ResourceCrudDialog
        isOpen={!!editingId}
        onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
        title="Edit Report"
        description="Update the details of your report."
        form={ReportForm}
        resourcePath="reports"
        resourceKey={["reports"]}
        resourceId={editingId}
      />
    </>
  );
}
