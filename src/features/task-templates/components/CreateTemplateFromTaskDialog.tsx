
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useManageTaskTemplates } from "../api/useManageTaskTemplates";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Task } from "@/features/tasks/task.types";

const formSchema = z.object({
  name: z.string().min(1, "Template name is required."),
});
type FormValues = z.infer<typeof formSchema>;

interface CreateTemplateFromTaskDialogProps {
  workspaceId: string;
  projectId: string;
  task: Task;
  onSuccess?: () => void;
}

export function CreateTemplateFromTaskForm({
  workspaceId,
  projectId,
  task,
  onSuccess,
}: CreateTemplateFromTaskDialogProps) {
  const { useCreate } = useManageTaskTemplates(workspaceId, projectId);
  const createMutation = useCreate();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: task.title },
  });

  useEffect(() => {
    methods.reset({ name: `Template: ${task.title}` });
  }, [task, methods]);

  function onSubmit(values: FormValues) {
    const {
      id,
      createdAt,
      updatedAt,
      projectId: pId,
      workspaceId: wId,
      ...templateData
    } = task;

    createMutation.mutate({ name: values.name, templateData }, { onSuccess });
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Template Name"
            placeholder="Enter a name for the template"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving..." : "Save Template"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
