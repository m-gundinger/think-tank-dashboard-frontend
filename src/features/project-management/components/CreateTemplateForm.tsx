import { z } from "zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import {
  FormInput,
  FormRichTextEditor,
} from "@/components/shared/form/FormFields";

const templateSchema = z.object({
  name: nameSchema("Template"),
  description: descriptionSchema,
});

interface CreateTemplateFormProps {
  sourceProjectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function CreateTemplateForm({
  sourceProjectId,
  initialData,
  onSuccess,
}: CreateTemplateFormProps) {
  return (
    <ResourceForm
      schema={templateSchema}
      resourcePath="project-templates"
      resourceKey={["projectTemplates"]}
      initialData={initialData}
      onSuccess={onSuccess}
      processValues={(values) => ({ ...values, sourceProjectId })}
      renderFields={() => (
        <>
          <FormInput
            name="name"
            label="Template Name"
            placeholder="e.g., Standard Software Project"
          />
          <FormRichTextEditor
            name="description"
            label="Description (Optional)"
          />
        </>
      )}
    />
  );
}