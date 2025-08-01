import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";

const teamSchema = z.object({
  name: nameSchema("Team"),
  description: descriptionSchema,
});
type TeamFormValues = z.infer<typeof teamSchema>;

interface TeamFormProps {
  workspaceId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function TeamForm({
  workspaceId,
  initialData,
  onSuccess,
}: TeamFormProps) {
  const isEditMode = !!initialData;
  const teamResource = useApiResource(`/workspaces/${workspaceId}/teams`, [
    "teams",
    workspaceId,
  ]);
  const createMutation = teamResource.useCreate();
  const updateMutation = teamResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
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
  async function onSubmit(values: TeamFormValues) {
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
            label="Team Name"
            placeholder="e.g. Research Division"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A short description of the team's purpose"
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
                : "Create Team"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}