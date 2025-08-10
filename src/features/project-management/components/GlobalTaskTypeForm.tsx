import { z } from "zod";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput } from "@/components/shared/form/FormFields";

const CreateTaskTypeDtoSchema = z.object({
  name: z.string().min(1, "Type name is required."),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

interface TaskTypeFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function GlobalTaskTypeForm({
  initialData,
  onSuccess,
}: TaskTypeFormProps) {
  return (
    <ResourceForm
      schema={CreateTaskTypeDtoSchema}
      resourcePath="task-types"
      resourceKey={["taskTypes", "global"]}
      initialData={initialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <>
          <FormInput
            name="name"
            label="Type Name"
            placeholder="e.g., Bug, Story, Spike"
          />
          <FormInput
            name="icon"
            label="Icon (Optional)"
            placeholder="e.g., Bug, Flame, Lightbulb"
          />
          <FormInput
            name="color"
            label="Color (Optional)"
            placeholder="e.g., #ff0000, blue.500"
          />
        </>
      )}
    />
  );
}