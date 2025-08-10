import { z } from "zod";
import { FormInput } from "@/components/form/FormFields";
import { useForgotPassword } from "../api/useForgotPassword";
import { Link } from "react-router-dom";
import { FormWrapper } from "@/components/form/FormWrapper";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  function onSubmit(values: ForgotPasswordFormValues) {
    forgotPasswordMutation.mutate(values.email);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Forgot Password?</h1>
        <p className="text-muted-foreground">
          Enter your email and we'll send you a link to reset it.
        </p>
      </div>
      <FormWrapper
        schema={forgotPasswordSchema}
        onSubmit={onSubmit}
        mutation={forgotPasswordMutation}
        submitButtonText="Send Reset Link"
        defaultValues={{ email: "" }}
        renderFields={() => (
          <FormInput
            name="email"
            label="Email"
            placeholder="name@example.com"
          />
        )}
      />
      <div className="mt-4 text-center text-sm">
        <Link to="/login" className="underline hover:text-primary">
          Back to login
        </Link>
      </div>
    </div>
  );
}
