import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateView } from "@/features/views/api/useCreateView";
import { toast } from "sonner";
import { nameSchema, descriptionSchema } from "@/lib/schemas";

const projectSchema = z.object({
  name: nameSchema("Project"),
  description: descriptionSchema,
});
type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  workspaceId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function ProjectForm({
  workspaceId,
  initialData,
  onSuccess,
}: ProjectFormProps) {
  const isEditMode = !!initialData;
  const projectResource = useApiResource(
    `/workspaces/${workspaceId}/projects`,
    ["projects", workspaceId]
  );
  const createProjectMutation = projectResource.useCreate();
  const updateMutation = projectResource.useUpdate();
  const createViewMutation = useCreateView(workspaceId);

  const methods = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
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
  async function onSubmit(values: ProjectFormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      createProjectMutation.mutate(values, {
        onSuccess: async (newProject) => {
          toast.success(
            `Project "${newProject.name}" created. Setting up default views...`
          );
          const listPromise = createViewMutation.mutateAsync({
            viewData: { name: "List", type: "LIST" },
            projectId: newProject.id,
          });
          const kanbanPromise = createViewMutation.mutateAsync({
            viewData: {
              name: "Kanban",
              type: "KANBAN",
              columns: [
                { name: "To Do" },
                { name: "In Progress" },
                { name: "In Review" },
                { name: "Done" },
              ],
            },
            projectId: newProject.id,
          });
          await Promise.all([listPromise, kanbanPromise]);
          toast.success("Default views created.");
          onSuccess?.();
        },
      });
    }
  }

  const mutation = isEditMode ? updateMutation : createProjectMutation;
  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Project Name"
            placeholder="e.g. Annual Report Analysis"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A short description of the project's goals"
          />
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
                : "Create Project"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
