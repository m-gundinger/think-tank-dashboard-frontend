import { z } from "zod";
import {
  FormMultiSelectPopover,
  FormRichTextEditor,
} from "@/components/shared/form/FormFields";
import { NotificationSeverity, NotificationType } from "@/types/api";
import { useBroadcastNotification } from "../api/useBroadcastNotification";
import { useApiResource } from "@/hooks/useApiResource";
import { FormWrapper } from "@/components/shared/form/FormWrapper";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const roleOptions =
    rolesData?.data?.map((role: any) => ({
      id: role.id,
      name: role.name,
    })) || [];

  function onSubmit(values: BroadcastFormValues) {
    const payload: any = {
      message: values.message,
      severity: values.severity,
      type: values.type,
    };
    if (values.targetRoleIds && values.targetRoleIds.length > 0) {
      payload.target = { roleIds: values.targetRoleIds };
    }
    broadcastMutation.mutate(payload, { onSuccess });
  }

  return (
    <FormWrapper
      schema={broadcastSchema}
      onSubmit={onSubmit}
      mutation={broadcastMutation}
      submitButtonText="Send Broadcast"
      defaultValues={{
        message: "",
        severity: NotificationSeverity.MEDIUM,
        type: NotificationType.SYSTEM_BROADCAST,
        targetRoleIds: [],
      }}
      renderFields={({ control }) => (
        <>
          <FormRichTextEditor name="message" label="Broadcast Message" />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
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
              control={control}
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
        </>
      )}
    />
  );
}
