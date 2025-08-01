import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@/types/api";

interface ActionFieldProps {
  control: Control<any>;
  index: number;
}

export function UpdateTaskStatusFields({ control, index }: ActionFieldProps) {
  return (
    <FormField
      control={control}
      name={`actions.${index}.config.status`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>New Status</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a new status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.values(TaskStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
