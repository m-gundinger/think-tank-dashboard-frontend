import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema, descriptionSchema } from "@/lib/schemas";

const workspaceSchema = z.object({
  name: nameSchema("Workspace"),
  description: descriptionSchema,
});
type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface WorkspaceFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function WorkspaceForm({ initialData, onSuccess }: WorkspaceFormProps) {
  const isEditMode = !!initialData;
  const workspaceResource = useApiResource("workspaces", ["workspaces"]);
  const createMutation = workspaceResource.useCreate();
  const updateMutation = workspaceResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
      });
    }
  }, [initialData, isEditMode, form]);

  async function onSubmit(values: WorkspaceFormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(values, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      });
    }
  }

  const errorMessage = (mutation.error as AxiosError<{ message?: string }>)
    ?.response?.data?.message;
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Workspace Name"
            placeholder="e.g. Q1 Research Projects"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A brief summary of this workspace"
          />
          {errorMessage && (
            <div className="text-sm font-medium text-red-500">
              {errorMessage}
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create Workspace"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}