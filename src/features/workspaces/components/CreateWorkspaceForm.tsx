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
import { useCreateWorkspace } from "../api/useCreateWorkspace";
import { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters."),
  description: z.string().optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface CreateWorkspaceFormProps {
  onSuccess?: () => void;
}

export function CreateWorkspaceForm({ onSuccess }: CreateWorkspaceFormProps) {
  const createMutation = useCreateWorkspace();
  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  async function onSubmit(values: WorkspaceFormValues) {
    await createMutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  }

  const errorMessage = (
    createMutation.error as AxiosError<{ message?: string }>
  )?.response?.data?.message;
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
                <Input placeholder="e.g. Q1 Research Projects" {...field} />
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
                <Input
                  placeholder="A brief summary of this workspace"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && (
          <div className="text-sm font-medium text-red-500">{errorMessage}</div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create Workspace"}
        </Button>
      </form>
    </Form>
  );
}
