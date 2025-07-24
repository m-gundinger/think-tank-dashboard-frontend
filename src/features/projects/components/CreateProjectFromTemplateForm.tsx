import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "@/components/form/FormFields";
import { useCreateProjectFromTemplate } from "../api/useManageProjectTemplates";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameSchema } from "@/lib/schemas";
import { useApiResource } from "@/hooks/useApiResource";

const formSchema = z.object({
  name: nameSchema("Project"),
  templateId: z.string().uuid("You must select a template."),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectFromTemplateFormProps {
  workspaceId: string;
  onSuccess?: () => void;
}

export function CreateProjectFromTemplateForm({
  workspaceId,
  onSuccess,
}: CreateProjectFromTemplateFormProps) {
  const { data: templatesData, isLoading: isLoadingTemplates } = useApiResource(
    "project-templates",
    ["projectTemplates"]
  ).useGetAll();

  const createMutation = useCreateProjectFromTemplate(workspaceId);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    await createMutation.mutateAsync(
      { templateId: values.templateId, name: values.name },
      { onSuccess }
    );
  }

  const templateOptions =
    templatesData?.data?.map((template: any) => ({
      value: template.id,
      label: template.name,
    })) || [];

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="New Project Name"
            placeholder="e.g., Q4 Marketing Campaign"
          />
          <FormSelect
            name="templateId"
            label="Template"
            placeholder={
              isLoadingTemplates ? "Loading templates..." : "Select a template"
            }
            options={templateOptions}
            disabled={isLoadingTemplates}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
