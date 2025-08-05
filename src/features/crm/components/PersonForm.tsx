import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormDatePicker,
  FormMultiSelect,
  FormTextarea,
} from "@/components/form/FormFields";
import { useManagePeople } from "../api/useManagePeople";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { requiredStringSchema, phoneNumberSchema } from "@/lib/schemas";
import { useGetSkills } from "@/features/crm/api/useGetSkills";

const personSchema = z.object({
  firstName: requiredStringSchema("First name"),
  lastName: requiredStringSchema("Last name"),
  email: z
    .string()
    .email("A valid email is required.")
    .optional()
    .or(z.literal("")),
  biography: z.string().optional().nullable(),
  phoneNumber: phoneNumberSchema,
  birthday: z.date().nullable().optional(),
  skillIds: z.array(z.string().uuid()).optional(),
});
type PersonFormValues = z.infer<typeof personSchema>;

interface PersonFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function PersonForm({ initialData, onSuccess }: PersonFormProps) {
  const { useCreate, useUpdate } = useManagePeople();
  const { data: skillsData, isLoading: isLoadingSkills } = useGetSkills();
  const isEditMode = !!initialData;
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      biography: "",
      phoneNumber: "",
      birthday: null,
      skillIds: [],
    },
  });
  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset({
        ...initialData,
        birthday: initialData.birthday ? new Date(initialData.birthday) : null,
        skillIds: initialData.skills?.map((s: any) => s.id) || [],
      });
    }
  }, [initialData, isEditMode, methods]);

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

  const skillOptions =
    skillsData?.map((skill: any) => ({
      value: skill.id,
      label: skill.name,
    })) || [];

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="firstName" label="First Name" placeholder="John" />
            <FormInput name="lastName" label="Last Name" placeholder="Doe" />
          </div>
          <FormInput
            name="email"
            label="Email Address"
            placeholder="name@example.com"
          />
          <FormTextarea name="biography" label="Biography" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="phoneNumber" label="Phone Number" />
            <FormDatePicker name="birthday" label="Birthday" />
          </div>
          <FormMultiSelect
            name="skillIds"
            label="Skills"
            placeholder={isLoadingSkills ? "Loading..." : "Select skills"}
            options={skillOptions}
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