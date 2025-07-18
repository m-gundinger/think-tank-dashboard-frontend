import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

  const {
    data: verificationData,
    isLoading: isVerifying,
    isError: isVerificationError,
    error: verificationError,
  } = useVerifyResetToken(token);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
    </div>
  );
}
