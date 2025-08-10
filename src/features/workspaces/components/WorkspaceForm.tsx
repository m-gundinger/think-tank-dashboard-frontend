import { z } from "zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput } from "@/components/shared/form/FormFields";

const workspaceSchema = z.object({
  name: nameSchema("Workspace"),
  description: descriptionSchema,
});

interface WorkspaceFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function WorkspaceForm({ initialData, onSuccess }: WorkspaceFormProps) {
  return (
    <ResourceForm
      schema={workspaceSchema}
      resourcePath="workspaces"
      resourceKey={["workspaces"]}
      initialData={initialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <>
          <FormInput
            name="name"
            label="Workspace Name"
            placeholder="e.g. Q1 Research Projects"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A brief summary of this workspace"
          />
        </>
      )}
    />
  );
}