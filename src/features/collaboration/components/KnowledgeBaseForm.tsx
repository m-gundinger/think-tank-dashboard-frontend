import { z } from "zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput } from "@/components/shared/form/FormFields";
import { useManageKnowledgeBases } from "../api/useManageKnowledgeBases";

const kbSchema = z.object({
  name: nameSchema("Knowledge base"),
  description: descriptionSchema,
});

interface KBFormProps {
  workspaceId?: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function KnowledgeBaseForm({
  workspaceId,
  initialData,
  onSuccess,
}: KBFormProps) {
  const kbResource = useManageKnowledgeBases();
  return (
    <ResourceForm
      schema={kbSchema}
      resourcePath={kbResource.resourceUrl}
      resourceKey={kbResource.resourceKey}
      initialData={initialData}
      onSuccess={onSuccess}
      processValues={(values) => ({ ...values, workspaceId })}
      renderFields={() => (
        <>
          <FormInput
            name="name"
            label="Knowledge Base Name"
            placeholder="e.g., Internal Documentation"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A short summary of this knowledge base"
          />
        </>
      )}
    />
  );
}
