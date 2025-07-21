import { FormInput } from "@/components/form/FormFields";

export function TaskListConfigFields() {
  return (
    <FormInput
      name="config.limit"
      label="Number of Tasks to Show"
      type="number"
      placeholder="e.g., 10"
    />
  );
}
