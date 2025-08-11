import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput } from "@/components/shared/form/FormFields";
import { z } from "zod";
import { Task } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Template name is required."),
});

interface CreateTemplateFromTaskDialogProps {
  workspaceId: string;
  projectId: string;
  task: Task;
  onSuccess?: () => void;
}

export function CreateTemplateFromTaskForm({
  projectId,
  task,
  onSuccess,
}: CreateTemplateFromTaskDialogProps) {
  return (
    <ResourceForm
      schema={formSchema}
      resourcePath="task-templates"
      resourceKey={["taskTemplates", projectId]}
      initialData={{ name: `Template: ${task.title}` }}
      onSuccess={onSuccess}
      processValues={(values) => {
        const {
          id: _id,
          createdAt: _createdAt,
          updatedAt: _updatedAt,
          projectId: _pId,
          workspaceId: _wId,
          ...templateData
        } = task;
        return { name: values.name, templateData, projectId };
      }}
      renderFields={() => (
        <FormInput
          name="name"
          label="Template Name"
          placeholder="Enter a name for the template"
        />
      )}
    />
  );
}