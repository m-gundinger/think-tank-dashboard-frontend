import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useManageKnowledgeBase } from "../api/useManageKnowledgeBase";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema, descriptionSchema } from "@/lib/schemas";

const kbSchema = z.object({
  name: nameSchema("Knowledge base"),
  description: descriptionSchema,
});
type KBFormValues = z.infer<typeof kbSchema>;

interface KBFormProps {
  workspaceId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function KnowledgeBaseForm({
  workspaceId,
  initialData,
  onSuccess,
}: KBFormProps) {
  const isEditMode = !!initialData;
  const kbResource = useManageKnowledgeBase(workspaceId);
  const createMutation = kbResource.useCreate();
  const updateMutation = kbResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<KBFormValues>({
    resolver: zodResolver(kbSchema),
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
  async function onSubmit(values: KBFormValues) {
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
            label="Knowledge Base Name"
            placeholder="e.g., Internal Documentation"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A short summary of this knowledge base"
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
                : "Create Knowledge Base"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}