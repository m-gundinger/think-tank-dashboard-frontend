import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGetNotificationPreferences } from "../api/useGetNotificationPreferences";
import { useUpdateNotificationPreferences } from "../api/useUpdateNotificationPreferences";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const notificationTypes = [
  "SYSTEM_BROADCAST",
  "TASK_ASSIGNMENT",
  "COMMENT_MENTION",
  "PROJECT_INVITE",
];

const emailFrequencies = ["NONE", "DAILY", "WEEKLY", "IMMEDIATELY"];

const preferencesSchema = z.object({
  preferences: z.record(
    z.string(),
    z.object({
      inApp: z.boolean().optional(),
      email: z.boolean().optional(),
    })
  ),
  emailDigestFrequency: z.enum(["NONE", "DAILY", "WEEKLY", "IMMEDIATELY"]),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export function NotificationPreferencesForm() {
  const { data, isLoading } = useGetNotificationPreferences();
  const updateMutation = useUpdateNotificationPreferences();

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        preferences: data.preferences || {},
        emailDigestFrequency: data.emailDigestFrequency || "DAILY",
      });
    }
  }, [data, form]);

  function onSubmit(values: PreferencesFormValues) {
    updateMutation.mutate(values);
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how and when you are notified about activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {notificationTypes.map((type) => (
              <FormField
                key={type}
                control={form.control}
                name={`preferences.${type}.inApp`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base capitalize">
                        {type.replace(/_/g, " ").toLowerCase()}
                      </FormLabel>
                      <FormDescription>
                        Receive in-app notifications for this event.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name="emailDigestFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Digest Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {emailFrequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq.charAt(0) + freq.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how often you want to receive email summaries.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
