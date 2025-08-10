import {
  FormInput,
  FormDatePicker,
  FormMultiSelect,
  FormTextarea,
} from "@/components/shared/form/FormFields";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { z } from "zod";
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
interface PersonFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function PersonForm({ initialData, onSuccess }: PersonFormProps) {
  const { data: skillsData, isLoading: isLoadingSkills } = useGetSkills();

  const processedInitialData = initialData
    ? {
        ...initialData,
        birthday: initialData.birthday ? new Date(initialData.birthday) : null,
        skillIds: initialData.skills?.map((s: any) => s.id) || [],
      }
    : {
        birthday: null,
        skillIds: [],
      };

  return (
    <ResourceForm
      schema={personSchema}
      resourcePath="people"
      resourceKey={["people"]}
      initialData={processedInitialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <>
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
            options={
              skillsData?.map((skill: any) => ({
                id: skill.id,
                name: skill.name,
              })) || []
            }
          />
        </>
      )}
    />
  );
}