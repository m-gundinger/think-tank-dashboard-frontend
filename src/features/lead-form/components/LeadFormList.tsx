import { useState } from "react";
import { useManageLeadForms } from "../api/useManageLeadForms";
import { EntityCard } from "@/components/ui/EntityCard";
import { ClipboardList } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { LeadForm } from "./LeadForm";

interface LeadFormListProps {
  workspaceId: string;
  projectId: string;
}

export function LeadFormList({ workspaceId, projectId }: LeadFormListProps) {
  const { useGetAll, useDelete } = useManageLeadForms(workspaceId, projectId);
  const { data, isLoading } = useGetAll();
  const deleteMutation = useDelete();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) return <div>Loading forms...</div>;
  if (!data?.data || data.data.length === 0)
    return <div>No lead forms created for this project yet.</div>;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((form: any) => (
          <EntityCard
            key={form.id}
            title={form.name}
            description={`${form.fields.length} fields`}
            icon={ClipboardList}
            onEdit={() => setEditingId(form.id)}
            onDelete={() => deleteMutation.mutate(form.id)}
          >
            <></>
          </EntityCard>
        ))}
      </div>
      <ResourceCrudDialog
        isOpen={!!editingId}
        onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
        resourceId={editingId}
        resourcePath={`workspaces/${workspaceId}/projects/${projectId}/lead-forms`}
        resourceKey={["leadForms", projectId]}
        title="Edit Lead Form"
        description="Update the name of your lead form."
        form={LeadForm}
        formProps={{ workspaceId, projectId }}
      />
    </>
  );
}
