// FILE: src/features/crm/components/CompanyForm.tsx
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema, descriptionSchema } from "@/lib/schemas";

const companySchema = z.object({
  name: nameSchema("Company name"),
  description: descriptionSchema,
  domain: z.string().optional().nullable(),
});
type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function CompanyForm({ initialData, onSuccess }: CompanyFormProps) {
  const companyResource = useApiResource("companies", ["companies"]);
  const isEditMode = !!initialData;
  const createMutation = companyResource.useCreate();
  const updateMutation = companyResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      domain: "",
    },
  });
  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);
  async function onSubmit(values: CompanyFormValues) {
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
          <FormInput name="name" label="Company Name" placeholder="Acme Inc." />
          <FormInput
            name="domain"
            label="Website Domain (Optional)"
            placeholder="acme.com"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A short summary of the company"
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
                : "Create Company"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
