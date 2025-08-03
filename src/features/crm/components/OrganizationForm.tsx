import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useManageOrganizations } from "../api/useManageOrganizations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema, descriptionSchema } from "@/lib/schemas";

const organizationSchema = z.object({
  name: nameSchema("Organization name"),
  description: descriptionSchema,
  domain: z.string().optional().nullable(),
});
type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function OrganizationForm({
  initialData,
  onSuccess,
}: OrganizationFormProps) {
  const { useCreate, useUpdate } = useManageOrganizations();
  const isEditMode = !!initialData;
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
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
  async function onSubmit(values: OrganizationFormValues) {
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
            label="Organization Name"
            placeholder="Acme Inc."
          />
          <FormInput
            name="domain"
            label="Website Domain (Optional)"
            placeholder="acme.com"
          />
          <FormInput
            name="description"
            label="Description (Optional)"
            placeholder="A short summary of the organization"
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
                : "Create Organization"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}