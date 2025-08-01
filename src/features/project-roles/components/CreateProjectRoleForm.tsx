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
import { useApiResource } from "@/hooks/useApiResource";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameSchema } from "@/lib/schemas";

const projectRoleSchema = z.object({
  name: nameSchema("Role"),
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
  const projectRoleResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/roles`,
    ["projectRoles", projectId]
  );
  const createMutation = projectRoleResource.useCreate();

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