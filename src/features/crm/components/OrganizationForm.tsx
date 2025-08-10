import { z } from "zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput, FormTextarea } from "@/components/shared/form/FormFields";

const organizationSchema = z.object({
  name: nameSchema("Organization name"),
  description: descriptionSchema,
  domain: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
});

interface OrganizationFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function OrganizationForm({
  initialData,
  onSuccess,
}: OrganizationFormProps) {
  return (
    <ResourceForm
      schema={organizationSchema}
      resourcePath="organizations"
      resourceKey={["organizations"]}
      initialData={initialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <>
          <FormInput
            name="name"
            label="Organization Name"
            placeholder="Acme Inc."
          />
          <FormInput
            name="domain"
            label="Website Domain (Optional)"
            placeholder="acme.com"
          />
          <FormTextarea
            name="description"
            label="Description (Optional)"
            placeholder="A short summary of the organization"
          />
        </>
      )}
    />
  );
}