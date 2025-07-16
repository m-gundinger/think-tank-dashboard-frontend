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
import { useUpdateTeam } from "../api/useUpdateTeam";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const teamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters."),
  description: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

interface EditTeamFormProps {
  team: any;
  workspaceId: string;
  onSuccess?: () => void;
}

export function EditTeamForm({
  team,
  workspaceId,
  onSuccess,
}: EditTeamFormProps) {
  const updateMutation = useUpdateTeam(workspaceId, team.id);
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: "", description: "" },
  });
  useEffect(() => {
    if (team) {
      form.reset({
        name: team.name,
        description: team.description || "",
      });
    }
  }, [team, form]);
  async function onSubmit(values: TeamFormValues) {
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
              <FormLabel>Team Name</FormLabel>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
