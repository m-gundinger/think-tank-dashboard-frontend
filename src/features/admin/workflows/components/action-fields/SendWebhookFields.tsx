import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ActionFieldProps {
  control: Control<any>;
  index: number;
}

export function SendWebhookFields({ control, index }: ActionFieldProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`actions.${index}.config.url`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Webhook URL</FormLabel>
            <FormControl>
              <Input placeholder="https://api.example.com/webhook" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`actions.${index}.config.body`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payload Body (JSON)</FormLabel>
            <FormControl>
              <Textarea
                placeholder={`{ "content": "Task '{{task.title}}' was updated." }`}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}