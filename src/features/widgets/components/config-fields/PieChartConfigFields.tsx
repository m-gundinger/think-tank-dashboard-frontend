// FILE: src/features/widgets/components/config-fields/PieChartConfigFields.tsx
import { FormInput } from "@/components/form/FormFields";

export function PieChartConfigFields() {
  return (
    <div className="space-y-4">
      <FormInput
        name="config.title"
        label="Chart Title"
        placeholder="e.g., Tasks by Status"
      />
    </div>
  );
}
