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
import { useCreateProjectRole } from "../api/useCreateProjectRole";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const projectRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters."),
});
type ProjectRoleFormValues = z.infer<typeof projectRoleSchema>;

interface CreateProjectRoleFormProps {
  workspaceId: string;
  projectId: string;
  onSuccess?: () => void;
}

export function CreateProjectRoleForm({
  workspaceId,
  projectId,
  onSuccess,
}: CreateProjectRoleFormProps) {
  const createMutation = useCreateProjectRole(workspaceId, projectId);
  const form = useForm<ProjectRoleFormValues>({
    resolver: zodResolver(projectRoleSchema),
    defaultValues: { name: "" },
  });
  async function onSubmit(values: ProjectRoleFormValues) {
    createMutation.mutate(values, {
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
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Contributor" {...field} />
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
          {createMutation.isPending ? "Creating..." : "Create Role"}
        </Button>
      </form>
    </Form>
  );
}
