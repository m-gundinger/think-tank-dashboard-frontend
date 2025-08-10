import { z } from "zod";
import { FormInput } from "@/components/shared/form/FormFields";
import { useSetupPassword } from "../api/useSetupPassword";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { FormWrapper } from "@/components/shared/form/FormWrapper";

const setupPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SetupPasswordFormValues = z.infer<typeof setupPasswordSchema>;

export function SetupPasswordForm() {
  const setupPasswordMutation = useSetupPassword();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  function onSubmit(values: SetupPasswordFormValues) {
    setupPasswordMutation.mutate(values);
  }

  if (!token) {
    return (
      <div className="text-center text-red-500">
        Invalid or missing invitation token. Please contact an administrator.
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        <p className="text-muted-foreground">
          Set up your password to activate your account.
        </p>
      </div>
      <FormWrapper
        schema={setupPasswordSchema}
        onSubmit={onSubmit}
        mutation={setupPasswordMutation}
        submitButtonText="Set Password & Login"
        defaultValues={{
          token: token || "",
          newPassword: "",
          confirmPassword: "",
        }}
        renderFields={({ setValue }) => {
          useEffect(() => {
            if (token) {
              setValue("token", token);
            }
          }, [token, setValue]);
          return (
            <>
              <FormInput
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="••••••••"
              />
              <FormInput
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
              />
            </>
          );
        }}
      />
    </div>
  );
}