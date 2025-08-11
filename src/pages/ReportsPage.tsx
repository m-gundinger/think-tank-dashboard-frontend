import { ReportForm } from "@/features/analytics/components/ReportForm";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart } from "lucide-react";
import { useState } from "react";
import { useManageReports } from "@/features/analytics/api/useManageReports";
import { ReportCard } from "@/features/analytics/components/ReportCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";

const ListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-36 w-full" />
    ))}
  </div>
);

export function ReportsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { useGetAll } = useManageReports();
  const { data, isLoading, isError } = useGetAll({
    sortBy: "title",
    sortOrder: "asc",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const renderContent = () => {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report: any) => (
          <ReportCard
            key={report.id}
            report={report}
            onEdit={() => setEditingId(report.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>
      {renderContent()}
      <ResourceCrudDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create a new report"
        description="Configure a new report to track your metrics."
        form={ReportForm}
        resourcePath="reports"
        resourceKey={["reports"]}
      />
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
    </div>
  );
}
