import { FormInput, FormSelect } from "@/components/form/FormFields";
import { TaskStatus } from "@/types/api";

export function StatsCounterConfigFields() {
  const statusOptions = Object.values(TaskStatus).map((status) => ({
    value: status,
    label: status,
  }));

  return (
    <div className="space-y-4">
      <FormInput
        name="config.label"
        label="Label"
        placeholder="e.g., Open Tasks"
      />
      <FormSelect
        name="config.filter.status"
        label="Task Status to Count"
        placeholder="Select a status"
        options={statusOptions}
      />
    </div>
  );
}