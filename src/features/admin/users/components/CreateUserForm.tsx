import { z } from "zod";
import { ResourceForm } from "@/components/form/ResourceForm";
import {
  FormInput,
  FormMultiSelectPopover,
} from "@/components/form/FormFields";
import { useManageRoles } from "../../roles/api/useManageRoles";

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
  initialData?: CreateUserFormValues;
}

export function CreateUserForm({
  onSuccess,
  initialData,
}: CreateUserFormProps) {
  const { data: rolesData, isLoading: isLoadingRoles } =
    useManageRoles().useGetAll();

  const roleOptions =
    rolesData?.data.map((role: any) => ({
      id: role.id,
      name: role.name,
    })) || [];

  return (
    <ResourceForm
      schema={createUserSchema}
      resourcePath="admin/users"
      resourceKey={["users"]}
      initialData={initialData}
      onSuccess={onSuccess}
      processValues={(values) => {
        const roleNames =
          rolesData?.data
            .filter((r: any) => values.roles?.includes(r.id))
            .map((r: any) => r.name) || [];
        return { ...values, roles: roleNames };
      }}
      renderFields={() => (
        <>
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
        </>
      )}
    />
  );
}
