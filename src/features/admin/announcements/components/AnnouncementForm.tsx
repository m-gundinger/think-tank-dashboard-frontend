import { z } from "zod";
import { ResourceForm } from "@/components/form/ResourceForm";
import {
  FormInput,
  FormRichTextEditor,
  FormSelect,
  FormSwitch,
} from "@/components/form/FormFields";
import { AnnouncementSeverity, PublicationStatus } from "@/types/api";
import { Announcement } from "@/types";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  status: z.nativeEnum(PublicationStatus),
  severity: z.nativeEnum(AnnouncementSeverity),
  isPinned: z.boolean(),
});

interface AnnouncementFormProps {
  initialData?: Announcement;
  onSuccess?: () => void;
}

export function AnnouncementForm({
  initialData,
  onSuccess,
}: AnnouncementFormProps) {
  const statusOptions = Object.values(PublicationStatus).map((s) => ({
    value: s,
    label: s.charAt(0) + s.slice(1).toLowerCase(),
  }));

  const severityOptions = Object.values(AnnouncementSeverity).map((s) => ({
    value: s,
    label: s.charAt(0) + s.slice(1).toLowerCase(),
  }));

  const processedInitialData = initialData
    ? {
        ...initialData,
        content: initialData.content?.message || "",
      }
    : undefined;

  return (
    <ResourceForm
      schema={announcementSchema}
      resourcePath="announcements"
      resourceKey={["announcements"]}
      initialData={processedInitialData}
      onSuccess={onSuccess}
      processValues={(values) => ({
        ...values,
        content: { message: values.content },
      })}
      renderFields={() => (
        <>
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
        </>
      )}
    />
  );
}
