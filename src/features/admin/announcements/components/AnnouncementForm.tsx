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
import { AnnouncementSeverity, PublicationStatus } from "@/types/api";
import { Announcement } from "@/types";

interface AnnouncementFormProps {
  initialData?: Announcement;
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
      await updateMutation.mutateAsync(
        { id: initialData.id, data: finalValues },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(finalValues, {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      });
    }
  }

  const statusOptions = Object.values(PublicationStatus).map((s) => ({
    value: s,
    label: s.charAt(0) + s.slice(1).toLowerCase(),
  }));
  const severityOptions = Object.values(AnnouncementSeverity).map((s) => ({
    value: s,
    label: s.charAt(0) + s.slice(1).toLowerCase(),
  }));
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