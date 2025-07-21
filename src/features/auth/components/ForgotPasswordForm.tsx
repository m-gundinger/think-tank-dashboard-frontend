import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useForgotPassword } from "../api/useForgotPassword";
import { Link } from "react-router-dom";
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  const methods = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
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
      <FormProvider {...methods}>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="email"
              label="Email"
              placeholder="name@example.com"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending
                ? "Sending..."
                : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      </FormProvider>
      <div className="mt-4 text-center text-sm">
        <Link to="/login" className="hover:text-primary underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
