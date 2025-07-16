import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAnnouncement } from "../api/useCreateAnnouncement";
import { useUpdateAnnouncement } from "../api/useUpdateAnnouncement";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

interface AnnouncementFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function AnnouncementForm({
  initialData,
  onSuccess,
}: AnnouncementFormProps) {
  const isEditMode = !!initialData;
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const mutation = isEditMode ? updateMutation : createMutation;

  const form = useForm<any>({
    defaultValues: {
      title: "",
      content: "",
      status: "DRAFT",
      severity: "INFO",
      isPinned: false,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({
        ...initialData,
        content: initialData.content?.message || "",
      });
    }
  }, [initialData, isEditMode, form]);

  async function onSubmit(values: any) {
    const finalValues = {
      ...values,
      content: { message: values.content },
    };

    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: finalValues },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(finalValues, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., System Maintenance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                This content will be displayed to users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isPinned"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Pin Announcement</FormLabel>
                <FormDescription>
                  Pinned announcements will appear at the top.
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
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Create Announcement"}
        </Button>
      </form>
    </Form>
  );
}
