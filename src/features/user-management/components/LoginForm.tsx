import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useLogin } from "../api/useLogin";
import { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const loginMutation = useLogin();
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
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
      <FormProvider {...methods}>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
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
                  className="text-primary text-sm font-medium hover:underline"
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
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
