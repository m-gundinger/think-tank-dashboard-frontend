import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useManagePublicationCategories } from "../api/useManagePublicationCategories";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema } from "@/lib/schemas";

const categorySchema = z.object({
  name: nameSchema("Category"),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

interface PublicationCategoryFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function PublicationCategoryForm({
  initialData,
  onSuccess,
}: PublicationCategoryFormProps) {
  const { useCreate, useUpdate } = useManagePublicationCategories();
  const isEditMode = !!initialData;
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || { name: "" },
  });

  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  async function onSubmit(values: CategoryFormValues) {
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
            label="Category Name"
            placeholder="e.g., Research"
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
                : "Create Category"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}