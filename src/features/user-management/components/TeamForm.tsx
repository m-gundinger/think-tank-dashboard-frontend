import { z } from "zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput, FormTextarea } from "@/components/shared/form/FormFields";

const teamSchema = z.object({
  name: nameSchema("Team"),
  description: descriptionSchema,
});

interface TeamFormProps {
  workspaceId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function TeamForm({
  workspaceId,
  initialData,
  onSuccess,
}: TeamFormProps) {
  return (
    <ResourceForm
      schema={teamSchema}
      resourcePath={`workspaces/${workspaceId}/teams`}
      resourceKey={["teams", workspaceId]}
      initialData={initialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <>
          <FormInput
            name="name"
            label="Team Name"
            placeholder="e.g. Research Division"
          />
          <FormTextarea
            name="description"
            label="Description (Optional)"
            placeholder="A short description of the team's purpose"
          />
        </>
      )}
    />
  );
}
