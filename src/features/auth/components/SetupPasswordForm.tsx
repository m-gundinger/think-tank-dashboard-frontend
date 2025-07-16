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
import { useSetupPassword } from "../api/useSetupPassword";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

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

  const form = useForm<SetupPasswordFormValues>({
    resolver: zodResolver(setupPasswordSchema),
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
            disabled={setupPasswordMutation.isPending}
          >
            {setupPasswordMutation.isPending
              ? "Setting Password..."
              : "Set Password & Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
