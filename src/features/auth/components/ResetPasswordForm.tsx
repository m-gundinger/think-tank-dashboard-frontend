import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useResetPassword } from "../api/useResetPassword";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useVerifyResetToken } from "../api/useVerifyResetToken";
import { Skeleton } from "@/components/ui/skeleton";
const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const resetPasswordMutation = useResetPassword();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { isLoading: isVerifying, isError: isVerificationError } =
    useVerifyResetToken(token);
  const methods = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    if (token) {
      methods.setValue("token", token);
    }
  }, [token, methods]);
  function onSubmit(values: ResetPasswordFormValues) {
    resetPasswordMutation.mutate(values);
  }

  if (isVerifying) {
    return (
      <div className="w-full max-w-sm space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!token || isVerificationError) {
    return (
      <div className="w-full max-w-sm text-center">
        <h2 className="text-destructive text-2xl font-bold">Invalid Token</h2>
        <p className="text-muted-foreground mt-2">
          This password reset link is invalid or has expired.
        </p>
        <Button asChild className="mt-4">
          <Link to="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Reset Your Password</h1>
        <p className="text-muted-foreground">
          Enter and confirm your new password.
        </p>
      </div>
      <FormProvider {...methods}>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending
                ? "Resetting..."
                : "Reset Password"}
            </Button>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
