import { useForm } from "react-hook-form";
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
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotificationSeverity, NotificationType } from "@/types/api";
import { useBroadcastNotification } from "../api/useBroadcastNotification";

const broadcastSchema = z.object({
  message: z.string().min(1, "Message is required."),
  severity: z.nativeEnum(NotificationSeverity),
  type: z.nativeEnum(NotificationType),
});
type BroadcastFormValues = z.infer<typeof broadcastSchema>;

interface BroadcastFormProps {
  onSuccess?: () => void;
}

export function BroadcastNotificationForm({ onSuccess }: BroadcastFormProps) {
  const broadcastMutation = useBroadcastNotification();
  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      message: "",
      severity: NotificationSeverity.MEDIUM,
      type: NotificationType.SYSTEM_BROADCAST,
    },
  });
  async function onSubmit(values: BroadcastFormValues) {
    await broadcastMutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Broadcast Message</FormLabel>
              <FormControl>
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button
          type="submit"
          className="w-full"
          disabled={broadcastMutation.isPending}
        >
          {broadcastMutation.isPending ? "Sending..." : "Send Broadcast"}
        </Button>
      </form>
    </Form>
  );
}