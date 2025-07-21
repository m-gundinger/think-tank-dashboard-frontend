import { FormDatePicker } from "@/components/form/FormFields";

export function BurndownChartConfigFields() {
  return (
    <div className="space-y-4">
      <FormDatePicker name="config.startDate" label="Start Date" />
      <FormDatePicker name="config.endDate" label="End Date" />
    </div>
  );
}
