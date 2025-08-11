import { z } from "zod";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput } from "@/components/shared/form/FormFields";
import { useManageTaskTypes } from "../api/useManageTaskTypes";

const CreateTaskTypeDtoSchema = z.object({
  name: z.string().min(1, "Type name is required."),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

interface TaskTypeFormProps {
  workspaceId: string;
  projectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function TaskTypeForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: TaskTypeFormProps) {
  const { resourceUrl, resourceKey } = useManageTaskTypes(
    workspaceId,
    projectId
  );
  return (
    <ResourceForm
      schema={CreateTaskTypeDtoSchema}
      resourcePath={resourceUrl}
      resourceKey={resourceKey}
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