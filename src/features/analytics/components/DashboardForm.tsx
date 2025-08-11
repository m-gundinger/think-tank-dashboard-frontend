import { z } from "zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { useManageDashboards } from "../api/useManageDashboards";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput } from "@/components/shared/form/FormFields";

const dashboardSchema = z.object({
  name: nameSchema("Dashboard"),
  description: descriptionSchema,
});

interface DashboardFormProps {
  scope?: {
    workspaceId?: string;
    projectId?: string;
  };
  initialData?: any;
  onSuccess?: () => void;
}

export function DashboardForm({
  scope,
  initialData,
  onSuccess,
}: DashboardFormProps) {
  const dashboardResource = useManageDashboards(scope);

  return (
    <ResourceForm
      schema={dashboardSchema}
      resourcePath={dashboardResource.resourceUrl}
      resourceKey={dashboardResource.resourceKey}
      initialData={initialData}
      onSuccess={onSuccess}
      processValues={(values) => ({
        ...values,
        ...scope,
      })}
      renderFields={() => (
        <>
          <FormInput
            name="name"
            label="Dashboard Name"
            placeholder="e.g. Q3 Metrics"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A summary of what this dashboard tracks"
          />
        </>
      )}
    />
  );
}
