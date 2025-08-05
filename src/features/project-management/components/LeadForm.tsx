import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useManageLeadForms } from "../api/useManageLeadForms";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema } from "@/lib/schemas";

const leadFormSchema = z.object({
  name: nameSchema("Form"),
});
type LeadFormValues = z.infer<typeof leadFormSchema>;
interface LeadFormProps {
  initialData?: any;
  onSuccess?: () => void;
  projectId: string;
}

export function LeadForm({ initialData, onSuccess, projectId }: LeadFormProps) {
  const isEditMode = !!initialData;
  const { useCreate, useUpdate } = useManageLeadForms(projectId);
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset(initialData);
    }
  }, [initialData, isEditMode, methods]);

  async function onSubmit(values: LeadFormValues) {
    const payload = {
      ...values,
      projectId,
      fields: initialData?.fields || [
        { id: "name", label: "Name", type: "TEXT", required: true },
        { id: "email", label: "Email", type: "EMAIL", required: true },
      ],
    };
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: payload },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(payload, {
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
            label="Form Name"
            placeholder="e.g., Website Contact Form"
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
                : "Create Form"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
