// FILE: src/features/crm/components/PersonForm.tsx
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
import { useUpdatePerson } from "../api/useUpdatePerson";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const personSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z
    .string()
    .email("A valid email is required.")
    .optional()
    .or(z.literal("")),
});
type PersonFormValues = z.infer<typeof personSchema>;

interface PersonFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function PersonForm({ initialData, onSuccess }: PersonFormProps) {
  const isEditMode = !!initialData;
  const createMutation = useCreatePerson();
  const updateMutation = useUpdatePerson();
  const mutation = isEditMode ? updateMutation : createMutation;

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  async function onSubmit(values: PersonFormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { personId: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(values, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      });
    }
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
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Create Person"}
        </Button>
      </form>
    </Form>
  );
}
