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

export function AssignTaskActionFields({ control, index }: ActionFieldProps) {
  return (
    <FormField
      control={control}
      name={`actions.${index}.config.userId`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>User ID to Assign</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter the UUID of the user to assign"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
