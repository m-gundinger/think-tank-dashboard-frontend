import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormMultiSelectPopover,
  FormRichTextEditor,
} from "@/components/form/FormFields";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotificationSeverity, NotificationType } from "@/types/api";
import { useBroadcastNotification } from "../api/useBroadcastNotification";
import { useApiResource } from "@/hooks/useApiResource";

const broadcastSchema = z.object({
  message: z.string().min(1, "Message is required."),
  severity: z.nativeEnum(NotificationSeverity),
  type: z.nativeEnum(NotificationType),
  targetRoleIds: z.array(z.string().uuid()).optional(),
});
type BroadcastFormValues = z.infer<typeof broadcastSchema>;

interface BroadcastFormProps {
  onSuccess?: () => void;
}

export function BroadcastNotificationForm({ onSuccess }: BroadcastFormProps) {
  const broadcastMutation = useBroadcastNotification();
  const { data: rolesData, isLoading: isLoadingRoles } = useApiResource(
    "admin/roles",
    ["roles"]
  ).useGetAll();

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      message: "",
      severity: NotificationSeverity.MEDIUM,
      type: NotificationType.SYSTEM_BROADCAST,
      targetRoleIds: [],
    },
  });
  async function onSubmit(values: BroadcastFormValues) {
    const payload: any = {
      message: values.message,
      severity: values.severity,
      type: values.type,
    };
    if (values.targetRoleIds && values.targetRoleIds.length > 0) {
      payload.target = { roleIds: values.targetRoleIds };
    }
    await broadcastMutation.mutateAsync(payload, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  }

  const roleOptions =
    rolesData?.data?.map((role: any) => ({
      id: role.id,
      name: role.name,
    })) || [];

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormRichTextEditor name="message" label="Broadcast Message" />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(NotificationSeverity).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(NotificationType).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormMultiSelectPopover
            name="targetRoleIds"
            label="Target Roles (Optional)"
            placeholder={
              isLoadingRoles ? "Loading roles..." : "Broadcast to all users"
            }
            options={roleOptions}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={broadcastMutation.isPending}
          >
            {broadcastMutation.isPending ? "Sending..." : "Send Broadcast"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
