import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreatePermission } from "../api/useCreatePermission";
import { useUpdatePermission } from "../api/useUpdatePermission";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

const permissionSchema = z.object({
  action: z.string().min(1, "Action is required."),
  subject: z.string().min(1, "Subject is required."),
  description: z.string().optional(),
});
type PermissionFormValues = z.infer<typeof permissionSchema>;

interface PermissionFormProps {
  permission?: any;
  onSuccess?: () => void;
}

export function PermissionForm({ permission, onSuccess }: PermissionFormProps) {
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission(permission?.id);
  const mutation = permission ? updateMutation : createMutation;
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      action: "",
      subject: "",
      description: "",
    },
  });

  useEffect(() => {
    if (permission) {
      form.reset(permission);
    }
  }, [permission, form]);

  async function onSubmit(values: PermissionFormValues) {
    await mutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <FormControl>
                <Input placeholder="e.g., manage, create, read" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Project, Task, User" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : permission
              ? "Save Changes"
              : "Create Permission"}
        </Button>
      </form>
    </Form>
  );
}
