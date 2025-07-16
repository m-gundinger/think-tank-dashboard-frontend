import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ActionFieldProps {
  control: Control<any>;
  index: number;
}

export function CreateTaskFields({ control, index }: ActionFieldProps) {
  return (
    <FormField
      control={control}
      name={`actions.${index}.config.title`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Task Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter the title for the new task" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
