import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetEpic } from "../api/useGetEpics";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useUpdateEpic } from "../api/useUpdateEpic";
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
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const editEpicSchema = z.object({
  name: z.string().min(3, "Epic name must be at least 3 characters."),
  description: z.string().optional(),
});
type EditEpicFormValues = z.infer<typeof editEpicSchema>;

interface EditEpicDialogProps {
  epicId: string | null;
  workspaceId: string;
  projectId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditEpicDialog({
  epicId,
  workspaceId,
  projectId,
  isOpen,
  onOpenChange,
}: EditEpicDialogProps) {
  const { data: epic, isLoading } = useGetEpic(workspaceId, projectId, epicId);
  const updateMutation = useUpdateEpic(workspaceId, projectId, epicId!);
  const form = useForm<EditEpicFormValues>({
    resolver: zodResolver(editEpicSchema),
  });

  useEffect(() => {
    if (epic) {
      form.reset({
        name: epic.name,
        description: epic.description || "",
      });
    }
  }, [epic, form]);

  async function onSubmit(values: EditEpicFormValues) {
    updateMutation.mutate(values, {
      onSuccess: () => onOpenChange(false),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Epic</DialogTitle>
          <DialogDescription>
            Make changes to your epic's details.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          epic && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Epic Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
