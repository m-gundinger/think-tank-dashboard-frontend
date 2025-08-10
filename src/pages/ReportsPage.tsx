import { ReportList } from "@/features/analytics/components/ReportList";
import { ReportForm } from "@/features/analytics/components/ReportForm";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
export function ReportsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>
      <ReportList />
      <ResourceCrudDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create a new report"
        description="Configure a new report to track your metrics."
        form={ReportForm}
        resourcePath="reports"
        resourceKey={["reports"]}
      />
    </div>
  );
}