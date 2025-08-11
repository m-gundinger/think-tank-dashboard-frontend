import { CustomFieldType } from "@/types";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/shared/form/FormFields";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { z } from "zod";

const customFieldSchema = z.object({
  name: z.string().min(1, "Field name is required."),
  type: z.nativeEnum(CustomFieldType),
  options: z
    .object({
      values: z.union([z.array(z.string()), z.string()]),
    })
    .optional(),
});

interface FormProps {
  workspaceId: string;
  projectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function CustomFieldDefinitionForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: FormProps) {
  const isEditMode = !!initialData;

  const processedInitialData = initialData
    ? {
        ...initialData,
        options: {
          values: initialData.options?.values?.join(", ") || "",
        },
      }
    : {
        type: CustomFieldType.TEXT,
        options: { values: "" },
      };

  return (
    <ResourceForm
      schema={customFieldSchema}
      resourcePath={`workspaces/${workspaceId}/projects/${projectId}/custom-fields`}
      resourceKey={["customFieldDefinitions", projectId]}
      initialData={processedInitialData}
      onSuccess={onSuccess}
      processValues={(values) => {
        const payload: any = { name: values.name, type: values.type };
        if (values.type === "SELECT" && values.options) {
          payload.options = {
            values:
              typeof values.options.values === "string"
                ? values.options.values
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : values.options.values,
          };
        }
        return payload;
      }}
      renderFields={({ watch }) => {
        const selectedType = watch("type");
        const fieldTypeOptions = Object.values(CustomFieldType).map((type) => ({
          value: type,
          label: type,
        }));

        return (
          <>
            <FormInput
              name="name"
              label="Field Name"
              placeholder="e.g., Story Points"
            />
            <FormSelect
              name="type"
              label="Field Type"
              placeholder="Select a field type"
              options={fieldTypeOptions}
              disabled={isEditMode}
            />
            {selectedType === "SELECT" && (
              <FormTextarea
                name="options.values"
                label="Options"
                placeholder="Enter comma-separated values, e.g., Low, Medium, High"
              />
            )}
          </>
        );
      }}
    />
  );
}
