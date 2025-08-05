import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormMultiSelectPopover,
} from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserSchema = z.object({
  person: z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email("A valid email is required."),
  }),
  roles: z.array(z.string()).optional(),
});
type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const userResource = useApiResource("admin/users", ["users"]);
  const roleResource = useApiResource("admin/roles", ["roles"]);
  const createMutation = userResource.useCreate();
  const { data: rolesData, isLoading: isLoadingRoles } =
    roleResource.useGetAll();

  const methods = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      person: {
        firstName: "",
        lastName: "",
        email: "",
      },
      roles: [],
    },
  });

  async function onSubmit(values: CreateUserFormValues) {
    const roleNames =
      rolesData?.data
        .filter((r: any) => values.roles?.includes(r.id))
        .map((r: any) => r.name) || [];

    await createMutation.mutateAsync(
      { ...values, roles: roleNames },
      {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      }
    );
  }

  const errorMessage = (
    createMutation.error as AxiosError<{ message?: string }>
  )?.response?.data?.message;

  const roleOptions =
    rolesData?.data.map((role: any) => ({
      id: role.id,
      name: role.name,
    })) || [];

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="person.firstName"
            label="First Name"
            placeholder="John"
          />
          <FormInput
            name="person.lastName"
            label="Last Name"
            placeholder="Doe"
          />
          <FormInput
            name="person.email"
            label="Email Address"
            placeholder="name@example.com"
          />
          <FormMultiSelectPopover
            name="roles"
            label="Roles"
            placeholder={isLoadingRoles ? "Loading roles..." : "Select roles"}
            options={roleOptions}
          />

          {errorMessage && (
            <div className="text-sm font-medium text-red-500">
              {errorMessage}
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending
              ? "Sending Invite..."
              : "Create and Invite User"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}