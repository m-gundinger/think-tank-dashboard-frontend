import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormRichTextEditor } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { EpicStatus } from "@/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";

const epicSchema = z.object({
  name: nameSchema("Epic", 3),
  description: descriptionSchema,
  status: z.nativeEnum(EpicStatus),
});
type EpicFormValues = z.infer<typeof epicSchema>;

interface CreateEpicFormProps {
  workspaceId: string;
  projectId: string;
  onSuccess?: () => void;
}

export function CreateEpicForm({
  workspaceId,
  projectId,
  onSuccess,
}: CreateEpicFormProps) {
  const epicResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/epics`,
    ["epics", projectId]
  );
  const createMutation = epicResource.useCreate();

  const methods = useForm<EpicFormValues>({
    resolver: zodResolver(epicSchema),
    defaultValues: {
      name: "",
      description: "",
      status: EpicStatus.TODO,
    },
  });
  async function onSubmit(values: EpicFormValues) {
    await createMutation.mutateAsync(values, {
      onSuccess: () => {
        methods.reset();
        onSuccess?.();
      },
    });
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Epic Name"
            placeholder="e.g., 2025 Marketing Campaign"
          />
          <FormRichTextEditor name="description" label="Description" />
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Epic"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
