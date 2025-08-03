import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useManageReports } from "../api/useManageReports";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema } from "@/lib/schemas";

const reportSchema = z.object({
  title: nameSchema("Report"),
  // Additional fields for configuration can be added here later
});
type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function ReportForm({ initialData, onSuccess }: ReportFormProps) {
  const { useCreate, useUpdate } = useManageReports();
  const isEditMode = !!initialData;
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: initialData || {
      title: "",
    },
  });
  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);
  async function onSubmit(values: ReportFormValues) {
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
            name="title"
            label="Report Title"
            placeholder="e.g., Q3 Project Velocity"
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
                : "Create Report"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
