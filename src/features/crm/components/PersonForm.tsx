import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useManagePeople } from "../api/useManagePeople";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { requiredStringSchema } from "@/lib/schemas";

const personSchema = z.object({
  firstName: requiredStringSchema("First name"),
  lastName: requiredStringSchema("Last name"),
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
  const { useCreate, useUpdate } = useManagePeople();
  const isEditMode = !!initialData;
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);
  async function onSubmit(values: PersonFormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(values, {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      });
    }
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="firstName" label="First Name" placeholder="John" />
          <FormInput name="lastName" label="Last Name" placeholder="Doe" />
          <FormInput
            name="email"
            label="Email Address (Optional)"
            placeholder="name@example.com"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Person"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}