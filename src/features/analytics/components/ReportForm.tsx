import { z } from "zod";
import { nameSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/form/ResourceForm";
import { FormInput } from "@/components/form/FormFields";

const reportSchema = z.object({
  title: nameSchema("Report"),
});

interface ReportFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function ReportForm({ initialData, onSuccess }: ReportFormProps) {
  return (
    <ResourceForm
      schema={reportSchema}
      resourcePath="reports"
      resourceKey={["reports"]}
      initialData={initialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <FormInput
          name="title"
          label="Report Title"
          placeholder="e.g., Q3 Project Velocity"
        />
      )}
    />
  );
}
