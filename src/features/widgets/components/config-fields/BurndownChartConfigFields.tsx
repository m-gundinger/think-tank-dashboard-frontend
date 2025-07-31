import { FormDatePicker, FormSelect } from "@/components/form/FormFields";

export function BurndownChartConfigFields() {
  const unitOptions = [
    { value: "task_count", label: "Task Count" },
    { value: "story_points", label: "Story Points" },
  ];

  return (
    <div className="space-y-4">
      <FormDatePicker name="config.startDate" label="Start Date" />
      <FormDatePicker name="config.endDate" label="End Date" />
      <FormSelect
        name="config.unit"
        label="Unit"
        placeholder="Select unit"
        options={unitOptions}
      />
    </div>
  );
}
