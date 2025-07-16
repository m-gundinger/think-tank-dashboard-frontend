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
import { useCreateProject } from "../api/useCreateProject";
import { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateView } from "@/features/kanban/api/useCreateView";
import { toast } from "sonner";

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters."),
  description: z.string().optional(),
});
type ProjectFormValues = z.infer<typeof projectSchema>;

interface CreateProjectFormProps {
  workspaceId: string;
  onSuccess?: () => void;
}

export function CreateProjectForm({
  workspaceId,
  onSuccess,
}: CreateProjectFormProps) {
  const createProjectMutation = useCreateProject(workspaceId);
  const createViewMutation = useCreateView(workspaceId);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", description: "" },
  });
  async function onSubmit(values: ProjectFormValues) {
    createProjectMutation.mutate(values, {
      onSuccess: async (newProject) => {
        toast.success(
          `Project "${newProject.name}" created. Setting up default views...`
        );

        const listPromise = createViewMutation.mutateAsync({
          viewData: { name: "List", type: "LIST" },
          projectId: newProject.id,
        });
        const kanbanPromise = createViewMutation.mutateAsync({
          viewData: {
            name: "Kanban",
            type: "KANBAN",

            columns: [
              { name: "To Do" },
              { name: "In Progress" },
              { name: "In Review" },
              { name: "Done" },
            ],
          },
          projectId: newProject.id,
        });

        await Promise.all([listPromise, kanbanPromise]);

        toast.success("Default views created.");
        onSuccess?.();
      },
    });
  }

  const errorMessage = (
    createProjectMutation.error as AxiosError<{ message?: string }>
  )?.response?.data?.message;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Annual Report Analysis" {...field} />
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
                  placeholder="A short description of the project's goals"
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
          disabled={createProjectMutation.isPending}
        >
          {createProjectMutation.isPending ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </Form>
  );
}
