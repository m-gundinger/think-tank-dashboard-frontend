import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "@/components/form/FormFields";
import { useManageViews } from "../api/useManageViews";
import { useEffect } from "react";
import { ViewType } from "@/types/api";
import { View } from "@/types";

interface ViewFormProps {
  workspaceId: string;
  projectId: string;
  initialData?: View;
  onSuccess?: () => void;
}

export function ViewForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: ViewFormProps) {
  const isEditMode = !!initialData;
  const { useCreate, useUpdate } = useManageViews(workspaceId, projectId);
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<any>({
    defaultValues: { name: "", type: ViewType.LIST },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset(initialData);
    }
  }, [initialData, isEditMode, methods]);

  async function onSubmit(values: any) {
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

  const viewTypeOptions = Object.values(ViewType).map((type) => ({
    value: type,
    label: type,
  }));

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="View Name"
            placeholder="e.g., Team Kanban"
          />
          <FormSelect
            name="type"
            label="View Type"
            placeholder="Select a view type"
            options={viewTypeOptions}
            disabled={isEditMode}
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
                : "Create View"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}