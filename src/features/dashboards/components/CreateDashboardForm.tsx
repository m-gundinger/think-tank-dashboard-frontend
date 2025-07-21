import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";

const dashboardSchema = z.object({
  name: nameSchema("Dashboard"),
  description: descriptionSchema,
});
type DashboardFormValues = z.infer<typeof dashboardSchema>;

interface DashboardFormProps {
  workspaceId: string;
  projectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function CreateDashboardForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: DashboardFormProps) {
  const isEditMode = !!initialData;
  const dashboardResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards`,
    ["dashboards", projectId]
  );
  const createMutation = dashboardResource.useCreate();
  const updateMutation = dashboardResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<DashboardFormValues>({
    resolver: zodResolver(dashboardSchema),
    defaultValues: { name: "", description: "" },
  });
  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset({
        name: initialData.name,
        description: initialData.description || "",
      });
    }
  }, [initialData, isEditMode, methods]);
  async function onSubmit(values: DashboardFormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(
        { ...values, projectId },
        {
          onSuccess: () => {
            methods.reset();
            onSuccess?.();
          },
        }
      );
    }
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Dashboard Name"
            placeholder="e.g. Q3 Metrics"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A summary of what this dashboard tracks"
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
                : "Create Dashboard"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
