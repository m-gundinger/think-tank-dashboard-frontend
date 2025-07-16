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
import { useCreateDashboard } from "../api/useCreateDashboard";
import { useUpdateDashboard } from "../api/useUpdateDashboard";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const dashboardSchema = z.object({
  name: z.string().min(2, "Dashboard name must be at least 2 characters."),
  description: z.string().optional(),
});

type DashboardFormValues = z.infer<typeof dashboardSchema>;

interface DashboardFormProps {
  workspaceId: string;
  projectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function CreateDashboardForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: DashboardFormProps) {
  const isEditMode = !!initialData;
  const createMutation = useCreateDashboard(workspaceId, projectId);
  const updateMutation = useUpdateDashboard(
    workspaceId,
    projectId,
    initialData?.id
  );
  const mutation = isEditMode ? updateMutation : createMutation;

  const form = useForm<DashboardFormValues>({
    resolver: zodResolver(dashboardSchema),
    defaultValues: { name: "", description: "" },
  });
  useEffect(() => {
    if (isEditMode && initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
      });
    }
  }, [initialData, isEditMode, form]);
  async function onSubmit(values: DashboardFormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(values, { onSuccess });
    } else {
      await createMutation.mutateAsync(
        { ...values, projectId },
        {
          onSuccess: () => {
            form.reset();
            onSuccess?.();
          },
        }
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dashboard Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Q3 Metrics" {...field} />
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
                  placeholder="A summary of what this dashboard tracks"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Create Dashboard"}
        </Button>
      </form>
    </Form>
  );
}
