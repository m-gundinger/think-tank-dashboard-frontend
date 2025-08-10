import { z } from "zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput, FormTextarea } from "@/components/shared/form/FormFields";

const roleSchema = z.object({
  name: nameSchema("Role"),
  description: descriptionSchema,
});

interface RoleFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function RoleForm({ initialData, onSuccess }: RoleFormProps) {
  const processedInitialData = initialData
    ? {
        ...initialData,
        description: initialData.description || "",
      }
    : undefined;

  return (
    <ResourceForm
      schema={roleSchema}
      resourcePath="admin/roles"
      resourceKey={["roles"]}
      initialData={processedInitialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <>
          <FormInput
            name="name"
            label="Role Name"
            placeholder="e.g., Content Manager"
          />
          <FormTextarea
            name="description"
            label="Description"
            placeholder="What this role can do"
          />
        </>
      )}
    />
  );
}