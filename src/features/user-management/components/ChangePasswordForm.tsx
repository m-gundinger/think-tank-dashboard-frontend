import { z } from "zod";
import { FormInput } from "@/components/shared/form/FormFields";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useChangePassword } from "../api/useChangePassword";
import { FormWrapper } from "@/components/shared/form/FormWrapper";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();

  function onSubmit(values: ChangePasswordFormValues) {
    changePasswordMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          For your security, we recommend choosing a strong password that you
          don't use elsewhere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormWrapper
          schema={changePasswordSchema}
          onSubmit={onSubmit}
          mutation={changePasswordMutation}
          submitButtonText="Change Password"
          renderFields={() => (
            <>
              <FormInput
                name="currentPassword"
                label="Current Password"
                type="password"
              />
              <FormInput
                name="newPassword"
                label="New Password"
                type="password"
              />
              <FormInput
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
              />
            </>
          )}
        />
      </CardContent>
    </Card>
  );
}