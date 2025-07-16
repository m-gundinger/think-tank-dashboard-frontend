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
import { useCreatePerson } from "../api/useCreatePerson";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createPersonSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z
    .string()
    .email("A valid email is required.")
    .optional()
    .or(z.literal("")),
});

type CreatePersonFormValues = z.infer<typeof createPersonSchema>;

interface CreatePersonFormProps {
  onSuccess?: () => void;
}

export function CreatePersonForm({ onSuccess }: CreatePersonFormProps) {
  const createMutation = useCreatePerson();

  const form = useForm<CreatePersonFormValues>({
    resolver: zodResolver(createPersonSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  async function onSubmit(values: CreatePersonFormValues) {
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
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
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
          {createMutation.isPending ? "Creating..." : "Create Person"}
        </Button>
      </form>
    </Form>
  );
}
