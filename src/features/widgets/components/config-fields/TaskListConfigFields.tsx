import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function TaskListConfigFields() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="config.limit"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Number of Tasks to Show</FormLabel>
          <FormControl>
            <Input type="number" placeholder="e.g., 10" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
