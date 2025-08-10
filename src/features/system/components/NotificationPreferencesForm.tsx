import { z } from "zod";
import {
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
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationType, EmailDigestFrequency } from "@/types/api";
import { FormWrapper } from "@/components/form/FormWrapper";

const notificationTypes = Object.values(NotificationType);
const emailFrequencies = Object.values(EmailDigestFrequency);

const preferencesSchema = z.object({
  preferences: z.record(
    z.string(),
    z.object({
      inApp: z.boolean().optional(),
      email: z.boolean().optional(),
    })
  ),
  emailDigestFrequency: z.nativeEnum(EmailDigestFrequency),
});
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export function NotificationPreferencesForm() {
  const { data, isLoading } = useGetNotificationPreferences();
  const updateMutation = useUpdateNotificationPreferences();

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
        <FormWrapper
          schema={preferencesSchema}
          onSubmit={onSubmit}
          mutation={updateMutation}
          defaultValues={data}
          className="space-y-8"
          submitButtonText="Save Preferences"
          renderFields={({ control }) => (
            <>
              {notificationTypes.map((type) => (
                <FormField
                  key={type}
                  control={control}
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
                control={control}
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
            </>
          )}
        />
      </CardContent>
    </Card>
  );
}
