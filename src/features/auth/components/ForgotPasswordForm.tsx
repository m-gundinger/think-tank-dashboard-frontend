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
import { useForgotPassword } from "../api/useForgotPassword";
import { Link } from "react-router-dom";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
      <div className="mt-4 text-center text-sm">
        <Link to="/login" className="hover:text-primary underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
