import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { EntityCard } from "@/components/ui/EntityCard";
import { ClipboardList } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { LeadForm } from "./LeadForm";

interface LeadFormListProps {
  workspaceId: string;
  projectId: string;
}

interface LeadFormQuery {
  projectId: string;
}

export function LeadFormList({ projectId }: LeadFormListProps) {
  const { useGetAll, useDelete } = useApiResource<any, LeadFormQuery>(
    `projects/${projectId}/lead-forms`,
    ["leadForms", projectId]
  );
  const { data, isLoading } = useGetAll({ projectId });
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
        resourcePath={`projects/${projectId}/lead-forms`}
        resourceKey={["leadForms", projectId]}
        title="Edit Lead Form"
        description="Update the name of your lead form."
        form={LeadForm}
        formProps={{ projectId }}
      />
    </>
  );
}
