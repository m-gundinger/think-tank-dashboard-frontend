
import { FormInput } from "@/components/form/FormFields";

export function LeadCycleTimeConfigFields() {
  return (
    <div className="space-y-4">
      <FormInput
        name="config.title"
        label="Chart Title"
        placeholder="e.g., Task Lead Times"
      />
      {/* Additional config like date ranges could be added here */}
    </div>
  );
}
