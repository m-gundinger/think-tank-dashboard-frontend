import { EntityCard } from "@/components/shared/EntityCard";
import { useManageReports } from "../api/useManageReports";
import { BarChart } from "lucide-react";
import { Report } from "@/types";
import { ActionMenu } from "@/components/shared/ActionMenu";

interface ReportCardProps {
  report: Report;
  onEdit: () => void;
}

export function ReportCard({ report, onEdit }: ReportCardProps) {
  const { useDelete } = useManageReports();
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the report "${report.title}"?`
      )
    ) {
      deleteMutation.mutate(report.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit();
  };

  return (
    <EntityCard
      title={report.title}
      description={report.summary || "No summary provided."}
      icon={BarChart}
      actions={
        <ActionMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      }
    >
      <></>
    </EntityCard>
  );
}
