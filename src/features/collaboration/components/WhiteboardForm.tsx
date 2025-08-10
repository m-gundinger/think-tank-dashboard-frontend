import { z } from "zod";
import { nameSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput } from "@/components/shared/form/FormFields";

const whiteboardSchema = z.object({
  name: nameSchema("Whiteboard"),
});

interface WhiteboardFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function WhiteboardForm({
  initialData,
  onSuccess,
}: WhiteboardFormProps) {
  return (
    <ResourceForm
      schema={whiteboardSchema}
      resourcePath="whiteboards"
      resourceKey={["whiteboards"]}
      initialData={initialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <FormInput
          name="name"
          label="Whiteboard Name"
          placeholder="e.g., Q3 Brainstorming Session"
        />
      )}
    />
  );
}