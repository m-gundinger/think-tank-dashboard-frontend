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
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { useCreateEpic } from "../api/useCreateEpic";
import { EpicStatus } from "@/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const epicSchema = z.object({
  name: z.string().min(3, "Epic name must be at least 3 characters."),
  description: z.string().optional(),
  status: z.nativeEnum(EpicStatus),
});
type EpicFormValues = z.infer<typeof epicSchema>;

interface CreateEpicFormProps {
  workspaceId: string;
  projectId: string;
  onSuccess?: () => void;
}

export function CreateEpicForm({
  workspaceId,
  projectId,
  onSuccess,
}: CreateEpicFormProps) {
  const createMutation = useCreateEpic(workspaceId, projectId);
  const form = useForm<EpicFormValues>({
    resolver: zodResolver(epicSchema),
    defaultValues: {
      name: "",
      description: "",
      status: EpicStatus.TODO,
    },
  });
  async function onSubmit(values: EpicFormValues) {
    await createMutation.mutateAsync(values, {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Epic Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2025 Marketing Campaign" {...field} />
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
        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create Epic"}
        </Button>
      </form>
    </Form>
  );
}
