import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema } from "@/lib/schemas";
import { useManageWhiteboards } from "../api/useManageWhiteboards";

const whiteboardSchema = z.object({
  name: nameSchema("Whiteboard"),
});

type WhiteboardFormValues = z.infer<typeof whiteboardSchema>;

interface WhiteboardFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function WhiteboardForm({
  initialData,
  onSuccess,
}: WhiteboardFormProps) {
  const isEditMode = !!initialData;
  const { useCreate, useUpdate } = useManageWhiteboards();
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<WhiteboardFormValues>({
    resolver: zodResolver(whiteboardSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset(initialData);
    }
  }, [initialData, isEditMode, methods]);

  async function onSubmit(values: WhiteboardFormValues) {
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
            label="Whiteboard Name"
            placeholder="e.g., Q3 Brainstorming Session"
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
                : "Create Whiteboard"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
