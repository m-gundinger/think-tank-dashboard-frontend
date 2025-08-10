import { FormInput } from "@/components/shared/form/FormFields";

export function LeadCycleTimeConfigFields() {
  return (
    <div className="space-y-4">
      <FormInput
        name="config.title"
        label="Chart Title"
        placeholder="e.g., Task Lead Times"
      />
    </div>
  );
}
