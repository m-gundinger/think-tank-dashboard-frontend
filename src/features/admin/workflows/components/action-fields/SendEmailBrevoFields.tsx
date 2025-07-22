// FILE: src/features/admin/workflows/components/action-fields/SendEmailBrevoFields.tsx
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

export function SendEmailBrevoFields({ control, index }: ActionFieldProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`actions.${index}.config.templateId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brevo Template ID</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g., 4"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`actions.${index}.config.to`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recipients (JSON)</FormLabel>
            <FormControl>
              <Textarea
                placeholder={`[{"email": "test@example.com", "name": "Test User"}]`}
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
