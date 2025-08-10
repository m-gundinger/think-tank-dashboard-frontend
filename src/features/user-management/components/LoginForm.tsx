import { FormLabel } from "@/components/ui/form";
import { FormInput } from "@/components/shared/form/FormFields";
import { useLogin } from "../api/useLogin";
import { AxiosError } from "axios";
import { z } from "zod";
import { Link } from "react-router-dom";
import { FormWrapper } from "@/components/shared/form/FormWrapper";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const loginMutation = useLogin();

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  const getErrorMessage = () => {
    if (!loginMutation.isError || !loginMutation.error) {
      return null;
    }
    const error = loginMutation.error as AxiosError<{ message?: string }>;
    return error.response?.data?.message || "An unexpected error occurred.";
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>
      <FormWrapper
        schema={loginSchema}
        onSubmit={onSubmit}
        mutation={loginMutation}
        submitButtonText="Sign In"
        defaultValues={{ email: "", password: "" }}
        renderFields={() => (
          <>
            <FormInput
              name="email"
              label="Email"
              placeholder="name@example.com"
            />
            <div>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <FormInput
                name="password"
                label=""
                type="password"
                placeholder="••••••••"
                className="mt-2"
              />
            </div>

            {loginMutation.isError && (
              <div className="text-sm font-medium text-red-500">
                {getErrorMessage()}
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}