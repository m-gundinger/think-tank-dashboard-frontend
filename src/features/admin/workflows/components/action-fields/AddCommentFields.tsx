import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ActionFieldProps {
  control: Control<any>;
  index: number;
}

export function AddCommentActionFields({ control, index }: ActionFieldProps) {
  return (
    <FormField
      control={control}
      name={`actions.${index}.config.content`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Comment Content</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter the comment to add to the task..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
