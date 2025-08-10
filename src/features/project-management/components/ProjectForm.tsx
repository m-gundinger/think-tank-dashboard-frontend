import { z } from "zod";
import { toast } from "sonner";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { useCreateView } from "@/features/project-management/api/useCreateView";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput } from "@/components/shared/form/FormFields";
import { useManageProjects } from "../api/useManageProjects";

const projectSchema = z.object({
  name: nameSchema("Project"),
  description: descriptionSchema,
});

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
  const createViewMutation = useCreateView(workspaceId);
  const resource = useManageProjects(workspaceId);

  const handleCreateSuccess = async (newProject: any) => {
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
  };

  return (
    <ResourceForm
      schema={projectSchema}
      resourcePath={resource.resourceUrl}
      resourceKey={resource.resourceKey}
      initialData={initialData}
      onSuccess={initialData ? onSuccess : handleCreateSuccess}
      processValues={(values) => ({ ...values, workspaceId })}
      renderFields={() => (
        <>
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
        </>
      )}
    />
  );
}