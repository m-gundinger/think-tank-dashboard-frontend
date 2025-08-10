import {
  FormDatePicker,
  FormInput,
  FormMultiSelect,
  FormTextarea,
} from "@/components/form/FormFields";
import { ResourceForm } from "@/components/form/ResourceForm";
import { useGetSkills } from "@/features/crm/api/useGetSkills";
import { phoneNumberSchema, socialLinkSchema } from "@/lib/schemas";
import { formatDateForServer, parseServerDate } from "@/lib/utils";
import { SocialProvider } from "@/types/api";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email(),
  biography: z.string().optional().nullable(),
  phoneNumber: phoneNumberSchema,
  birthday: z.date().nullable().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  skillIds: z.array(z.string().uuid()).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: any;
  onSuccess?: () => void;
  isSelfProfile?: boolean;
}

export function UserForm({
  initialData,
  onSuccess,
  isSelfProfile = false,
}: UserFormProps) {
  const { data: skillsData, isLoading: isLoadingSkills } = useGetSkills();

  const resourcePath = isSelfProfile ? "users/me/profile" : "admin/users";
  const resourceKey = isSelfProfile ? ["profile"] : ["users"];

  const processedInitialData = initialData
    ? {
        ...initialData,
        birthday: parseServerDate(initialData.birthday),
        skillIds: initialData.skills?.map((s: any) => s.id) || [],
      }
    : undefined;

  return (
    <ResourceForm
      schema={userFormSchema}
      resourcePath={resourcePath}
      resourceKey={resourceKey}
      initialData={processedInitialData}
      onSuccess={onSuccess}
      processValues={(values) => {
        const { email, birthday, ...submissionData } = values;
        const formattedData: any = {
          ...submissionData,
          birthday: formatDateForServer(birthday),
        };

        if (!isSelfProfile) {
          formattedData.email = email;
        }

        return formattedData;
      }}
      renderFields={(form) => (
        <UserFormFields
          form={form}
          isSelfProfile={isSelfProfile}
          skillsData={skillsData}
          isLoadingSkills={isLoadingSkills}
        />
      )}
    />
  );
}

const UserFormFields = ({
  form,
  isSelfProfile,
  skillsData,
  isLoadingSkills,
}: {
  form: ReturnType<typeof useForm<UserFormValues>>;
  isSelfProfile: boolean;
  skillsData: any[] | undefined;
  isLoadingSkills: boolean;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput name="firstName" label="First Name" />
        <FormInput name="lastName" label="Last Name" />
      </div>

      <FormInput
        name="email"
        label="Email Address"
        readOnly={isSelfProfile}
        disabled={isSelfProfile}
      />
      {isSelfProfile && (
        <p className="text-[0.8rem] text-muted-foreground">
          Your email address cannot be changed from this page.
        </p>
      )}
      <FormTextarea name="biography" label="Biography" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput name="phoneNumber" label="Phone Number" />
        <FormDatePicker name="birthday" label="Date of Birth" />
      </div>

      <FormMultiSelect
        name="skillIds"
        label="Skills"
        options={skillsData || []}
        placeholder={isLoadingSkills ? "Loading skills..." : "Select skills..."}
      />

      <div>
        <FormLabel>Social Links</FormLabel>
        <div className="mt-2 space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormInput
                name={`socialLinks.${index}.url`}
                placeholder="https://example.com/username"
                className="flex-grow"
                label={""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ provider: SocialProvider.WEBSITE, url: "" })
            }
          >
            Add Social Link
          </Button>
        </div>
      </div>
    </div>
  );
};
