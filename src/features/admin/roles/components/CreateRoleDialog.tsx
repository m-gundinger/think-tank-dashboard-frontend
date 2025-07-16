import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateRole } from "../api/useCreateRole";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const roleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters."),
  description: z.string().optional(),
});
type RoleFormValues = z.infer<typeof roleSchema>;

export function CreateRoleDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const createMutation = useCreateRole();
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", description: "" },
  });
  async function onSubmit(values: RoleFormValues) {
    await createMutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        setIsOpen(false);
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define a new global role and assign permissions later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Content Manager" {...field} />
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
                    <Input placeholder="What this role can do" {...field} />
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
      </DialogContent>
    </Dialog>
  );
}
