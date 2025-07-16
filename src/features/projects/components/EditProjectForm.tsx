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
import { useUpdateProject } from "../api/useUpdateProject";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters."),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface EditProjectFormProps {
  project: any;
  onSuccess?: () => void;
}

export function EditProjectForm({ project, onSuccess }: EditProjectFormProps) {
  const updateMutation = useUpdateProject(project.workspaceId, project.id);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || "",
      });
    }
  }, [project, form]);
  async function onSubmit(values: ProjectFormValues) {
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
              <FormLabel>Project Name</FormLabel>
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
