import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormRichTextEditor,
  FormSelect,
  FormSwitch,
} from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
interface AnnouncementFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function AnnouncementForm({
  initialData,
  onSuccess,
}: AnnouncementFormProps) {
  const announcementResource = useApiResource("announcements", [
    "announcements",
  ]);
  const isEditMode = !!initialData;
  const createMutation = announcementResource.useCreate();
  const updateMutation = announcementResource.useUpdate();

  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<any>({
    defaultValues: {
      title: "",
      content: "",
      status: "DRAFT",
      severity: "INFO",
      isPinned: false,
    },
  });
  useEffect(() => {
    if (isEditMode) {
      methods.reset({
        ...initialData,
        content: initialData.content?.message || "",
      });
    }
  }, [initialData, isEditMode, methods]);
  async function onSubmit(values: any) {
    const finalValues = {
      ...values,
      content: { message: values.content },
    };
    if (isEditMode) {
      await updateMutation.mutate(
        { id: initialData.id, data: finalValues },
        { onSuccess }
      );
    } else {
      await createMutation.mutate(finalValues, {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      });
    }
  }

  const statusOptions = [
    { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "ARCHIVED", label: "Archived" },
  ];
  const severityOptions = [
    { value: "INFO", label: "Info" },
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "CRITICAL", label: "Critical" },
  ];
  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="title"
            label="Title"
            placeholder="e.g., System Maintenance"
          />
          <FormRichTextEditor
            name="content"
            label="Content"
            description="This content will be displayed to users."
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="status"
              label="Status"
              placeholder="Select status"
              options={statusOptions}
            />
            <FormSelect
              name="severity"
              label="Severity"
              placeholder="Select severity"
              options={severityOptions}
            />
          </div>
          <FormSwitch
            name="isPinned"
            label="Pin Announcement"
            description="Pinned announcements will appear at the top."
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
                : "Create Announcement"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
