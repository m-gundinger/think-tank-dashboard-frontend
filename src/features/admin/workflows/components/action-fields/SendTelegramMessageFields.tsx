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

export function SendTelegramMessageFields({
  control,
  index,
}: ActionFieldProps) {
  return (
    <FormField
      control={control}
      name={`actions.${index}.config.message`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Message</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter the message to send. Markdown is supported."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
