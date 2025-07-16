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
import { useUpdateWorkspace } from "../api/useUpdateWorkspace";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters."),
  description: z.string().optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface EditWorkspaceFormProps {
  workspace: any;
  onSuccess?: () => void;
}

export function EditWorkspaceForm({
  workspace,
  onSuccess,
}: EditWorkspaceFormProps) {
  const updateMutation = useUpdateWorkspace(workspace.id);
  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  useEffect(() => {
    if (workspace) {
      form.reset({
        name: workspace.name,
        description: workspace.description || "",
      });
    }
  }, [workspace, form]);
  async function onSubmit(values: WorkspaceFormValues) {
    await updateMutation.mutateAsync(values, {
      onSuccess,
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
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
