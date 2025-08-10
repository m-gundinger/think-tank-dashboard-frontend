import { z } from "zod";
import { descriptionSchema, requiredStringSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput, FormTextarea } from "@/components/shared/form/FormFields";

const permissionSchema = z.object({
  action: requiredStringSchema("Action"),
  subject: requiredStringSchema("Subject"),
  description: descriptionSchema,
});

interface PermissionFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function PermissionForm({
  initialData,
  onSuccess,
}: PermissionFormProps) {
  return (
    <ResourceForm
      schema={permissionSchema}
      resourcePath="admin/permissions"
      resourceKey={["permissions"]}
      initialData={initialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <>
          <FormInput
            name="action"
            label="Action"
            placeholder="e.g., manage, create, read"
          />
          <FormInput
            name="subject"
            label="Subject"
            placeholder="e.g., Project, Task, User"
          />
          <FormTextarea
            name="description"
            label="Description"
            placeholder="A short description of what this permission allows."
          />
        </>
      )}
    />
  );
}
