import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormDatePicker } from "@/components/form/FormFields";
import { useManageSprints } from "../api/useManageSprints";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { CreateSprintDtoSchema } from "../sprint.types";

type SprintFormValues = z.infer<typeof CreateSprintDtoSchema>;

interface CreateSprintFormProps {
  workspaceId: string;
  projectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function CreateSprintForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: CreateSprintFormProps) {
  const isEditMode = !!initialData;
  const sprintResource = useManageSprints(workspaceId, projectId);
  const createMutation = sprintResource.useCreate();
  const updateMutation = sprintResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<SprintFormValues>({
    resolver: zodResolver(CreateSprintDtoSchema),
    defaultValues: {
      name: "",
      goal: "",
      startDate: null,
      endDate: null,
      projectId,
    },
  });
  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset({
        ...initialData,
        startDate: initialData.startDate
          ? new Date(initialData.startDate)
          : null,
        endDate: initialData.endDate ? new Date(initialData.endDate) : null,
      });
    }
  }, [initialData, isEditMode, methods]);
  async function onSubmit(values: SprintFormValues) {
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
            label="Sprint Name"
            placeholder="e.g., October Sprint #1"
          />
          <FormInput
            name="goal"
            label="Sprint Goal (Optional)"
            placeholder="What is the main objective of this sprint?"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormDatePicker name="startDate" label="Start Date" />
            <FormDatePicker name="endDate" label="End Date" />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Sprint"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}