import { ReportList } from "@/features/reporting/components/ReportList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { ReportForm } from "@/features/reporting/components/ReportForm";

export function ReportingPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reporting</h1>
          <p className="text-muted-foreground">
            View and manage all your reports.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Report
            </Button>
          }
          title="Create a New Report"
          description="Configure a new report to track your metrics."
          form={ReportForm}
          resourcePath="reports"
          resourceKey={["reports"]}
        />
      </div>
      <ReportList />
    </div>
  );
}
