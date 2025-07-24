import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormRichTextEditor } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { useEffect } from "react";

const templateSchema = z.object({
  name: nameSchema("Template"),
  description: descriptionSchema,
});
type TemplateFormValues = z.infer<typeof templateSchema>;

interface CreateTemplateFormProps {
  workspaceId: string;
  projectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function CreateTemplateForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: CreateTemplateFormProps) {
  const isEditMode = !!initialData;
  const resource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/templates`,
    ["projectTemplates", projectId]
  );
  const createMutation = resource.useCreate();
  const updateMutation = resource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset(initialData);
    }
  }, [initialData, isEditMode, methods]);

  async function onSubmit(values: TemplateFormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(values, {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      });
    }
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Template Name"
            placeholder="e.g., Standard Software Project"
          />
          <FormRichTextEditor
            name="description"
            label="Description (Optional)"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Save Template"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
