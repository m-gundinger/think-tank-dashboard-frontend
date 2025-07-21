import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";

const roleSchema = z.object({
  name: nameSchema("Role"),
  description: descriptionSchema,
});
type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function RoleForm({ initialData, onSuccess }: RoleFormProps) {
  const isEditMode = !!initialData;
  const roleResource = useApiResource("admin/roles", ["roles"]);
  const createMutation = roleResource.useCreate();
  const updateMutation = roleResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
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

  async function onSubmit(values: RoleFormValues) {
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
            label="Role Name"
            placeholder="e.g., Content Manager"
          />
          <FormInput
            name="description"
            label="Description"
            placeholder="What this role can do"
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
                : "Create Role"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
