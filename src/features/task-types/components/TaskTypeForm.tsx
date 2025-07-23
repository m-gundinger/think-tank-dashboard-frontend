
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useManageTaskTypes } from "../api/useManageTaskTypes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { CreateTaskTypeDtoSchema } from "../task-type.types";

type TaskTypeFormValues = z.infer<typeof CreateTaskTypeDtoSchema>;

interface TaskTypeFormProps {
  workspaceId: string;
  projectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function TaskTypeForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: TaskTypeFormProps) {
  const isEditMode = !!initialData;
  const { useCreate, useUpdate } = useManageTaskTypes(workspaceId, projectId);
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<TaskTypeFormValues>({
    resolver: zodResolver(CreateTaskTypeDtoSchema),
    defaultValues: {
      name: "",
      icon: "",
      color: "",
    },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset(initialData);
    }
  }, [initialData, isEditMode, methods]);

  async function onSubmit(values: TaskTypeFormValues) {
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
            label="Type Name"
            placeholder="e.g., Bug, Story, Spike"
          />
          <FormInput
            name="icon"
            label="Icon (Optional)"
            placeholder="e.g., Bug, Flame, Lightbulb"
          />
          <FormInput
            name="color"
            label="Color (Optional)"
            placeholder="e.g., #ff0000, blue.500"
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
                : "Create Type"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
