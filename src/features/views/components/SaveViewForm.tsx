import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSwitch } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameSchema } from "@/lib/schemas";
import { ViewType } from "@/types";

const viewSchema = z.object({
  name: nameSchema("View"),
  isPublic: z.boolean(),
});
type ViewFormValues = z.infer<typeof viewSchema>;

interface SaveViewFormProps {
  workspaceId: string;
  projectId: string;
  viewConfig: {
    type: ViewType;
    filters?: any;
    sorting?: any;
    grouping?: any;
  };
  onSuccess?: () => void;
}

export function SaveViewForm({
  workspaceId,
  projectId,
  viewConfig,
  onSuccess,
}: SaveViewFormProps) {
  const viewResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/views`,
    ["views", projectId]
  );
  const createMutation = viewResource.useCreate();

  const methods = useForm<ViewFormValues>({
    resolver: zodResolver(viewSchema),
    defaultValues: { name: "", isPublic: true },
  });

  async function onSubmit(values: ViewFormValues) {
    const payload = {
      ...values,
      ...viewConfig,
    };
    await createMutation.mutateAsync(payload, {
      onSuccess,
    });
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="View Name"
            placeholder="e.g., My Team's High Priority Tasks"
          />
          <FormSwitch
            name="isPublic"
            label="Public View"
            description="Make this view visible to everyone in the project."
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving..." : "Save View"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
