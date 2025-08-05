import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/form/FormFields";
import { CustomFieldType } from "@/types/api";
import { useApiResource } from "@/hooks/useApiResource";
import { useEffect } from "react";

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
  const customFieldResource = useApiResource(
    `workspaces/${workspaceId}/projects/${projectId}/custom-fields`,
    ["customFieldDefinitions", projectId]
  );
  const createMutation = customFieldResource.useCreate();
  const updateMutation = customFieldResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<any>({
    defaultValues: {
      name: "",
      type: CustomFieldType.TEXT,
      options: { values: [] },
    },
  });
  const selectedType = methods.watch("type");

  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset({
        ...initialData,
        options: {
          values: initialData.options?.values || [],
        },
      });
    }
  }, [initialData, isEditMode, methods]);
  const onSubmit = (values: any) => {
    const basePayload: { name: string; type: string; options?: any } = {
      name: values.name,
      type: values.type,
    };
    if (values.type === "SELECT") {
      basePayload.options = {
        values:
          typeof values.options.values === "string"
            ? values.options.values
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : values.options.values,
      };
    }

    if (isEditMode) {
      updateMutation.mutate(
        { id: initialData.id, data: basePayload },
        { onSuccess }
      );
    } else {
      createMutation.mutate(basePayload, {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      });
    }
  };

  const fieldTypeOptions = Object.values(CustomFieldType).map((type) => ({
    value: type,
    label: type,
  }));
  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
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
              value={
                Array.isArray(methods.watch("options.values"))
                  ? methods.watch("options.values").join(", ")
                  : methods.watch("options.values")
              }
            />
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Field"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}