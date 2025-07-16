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
import { useCreateTeam } from "../api/useCreateTeam";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const teamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters."),
  description: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

interface CreateTeamFormProps {
  workspaceId: string;
  onSuccess?: () => void;
}

export function CreateTeamForm({
  workspaceId,
  onSuccess,
}: CreateTeamFormProps) {
  const createMutation = useCreateTeam(workspaceId);
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: "", description: "" },
  });
  async function onSubmit(values: TeamFormValues) {
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
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Research Division" {...field} />
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
                  placeholder="A short description of the team's purpose"
                  {...field}
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
          {createMutation.isPending ? "Creating..." : "Create Team"}
        </Button>
      </form>
    </Form>
  );
}
