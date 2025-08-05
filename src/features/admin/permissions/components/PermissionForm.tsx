import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormTextarea } from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { descriptionSchema, requiredStringSchema } from "@/lib/schemas";

const permissionSchema = z.object({
  action: requiredStringSchema("Action"),
  subject: requiredStringSchema("Subject"),
  description: descriptionSchema,
});
type PermissionFormValues = z.infer<typeof permissionSchema>;

interface PermissionFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function PermissionForm({
  initialData,
  onSuccess,
}: PermissionFormProps) {
  const permissionResource = useApiResource("admin/permissions", [
    "permissions",
  ]);
  const createMutation = permissionResource.useCreate();
  const updateMutation = permissionResource.useUpdate();
  const isEditMode = !!initialData;
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      action: "",
      subject: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  async function onSubmit(values: PermissionFormValues) {
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
            name="action"
            label="Action"
            placeholder="e.g., manage, create, read"
          />
          <FormInput
            name="subject"
            label="Subject"
            placeholder="e.g., Project, Task, User"
          />
          <FormTextarea
            name="description"
            label="Description"
            placeholder="A short description of what this permission allows."
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
                : "Create Permission"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}