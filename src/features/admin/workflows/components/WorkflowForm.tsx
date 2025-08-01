import { useForm, useFieldArray, useWatch } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ActivityActionType,
  TaskStatus,
  WorkflowActionType,
} from "@/types/api";
import { useApiResource } from "@/hooks/useApiResource";
import { ActionRepeater } from "./ActionRepeater";
import { PlusCircle } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createTaskConfigSchema = z.object({
  title: z.string().min(1),
});

const updateTaskStatusConfigSchema = z.object({
  status: z.enum(Object.values(TaskStatus) as [string, ...string[]]),
});

export const AddCommentActionConfigSchema = z.object({
  content: z.string().min(1),
});
export const AssignTaskActionConfigSchema = z.object({
  userId: z.string().uuid(),
});

export const SendTelegramMessageActionConfigSchema = z.object({
  message: z.string().min(1),
});
export const SendEmailBrevoActionConfigSchema = z.object({
  templateId: z.number().int().positive(),
  to: z.array(z.object({ email: z.string().email(), name: z.string() })),
  params: z.record(z.string(), z.unknown()).optional(),
});

const workflowActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(WorkflowActionType.CREATE_TASK),
    config: createTaskConfigSchema,
    order: z.number().int().min(0),
  }),
  z.object({
    type: z.literal(WorkflowActionType.UPDATE_TASK_STATUS),
    config: updateTaskStatusConfigSchema,
    order: z.number().int().min(0),
  }),
  z.object({
    type: z.literal(WorkflowActionType.ADD_COMMENT),
    config: AddCommentActionConfigSchema,
    order: z.number().int().min(0),
  }),
  z.object({
    type: z.literal(WorkflowActionType.ASSIGN_TASK),
    config: AssignTaskActionConfigSchema,
    order: z.number().int().min(0),
  }),
  z.object({
    type: z.literal(WorkflowActionType.SEND_TELEGRAM_MESSAGE),
    config: SendTelegramMessageActionConfigSchema,
    order: z.number().int().min(0),
  }),

  z.object({
    type: z.literal(WorkflowActionType.SEND_EMAIL_BREVO),
    config: SendEmailBrevoActionConfigSchema,
    order: z.number().int().min(0),
  }),
]);

const workflowSchema = z
  .object({
    name: z.string().min(1, "Workflow name is required."),
    description: z.string().optional(),
    triggerMode: z.enum(["event", "schedule"]),
    triggerType: z.nativeEnum(ActivityActionType).optional().nullable(),
    cronExpression: z.string().optional().nullable(),
    enabled: z.boolean(),
    actions: z.array(workflowActionSchema),
  })
  .refine(
    (data) => {
      if (data.triggerMode === "event") {
        return !!data.triggerType;
      }
      return true;
    },
    {
      message: "An event type is required for event-based triggers.",
      path: ["triggerType"],
    }
  )
  .refine(
    (data) => {
      if (data.triggerMode === "schedule") {
        return !!data.cronExpression && data.cronExpression.length > 0;
      }
      return true;
    },
    {
      message: "A CRON expression is required for scheduled triggers.",
      path: ["cronExpression"],
    }
  );

type WorkflowFormValues = z.infer<typeof workflowSchema>;

interface WorkflowFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function WorkflowForm({ initialData, onSuccess }: WorkflowFormProps) {
  const workflowResource = useApiResource("admin/workflows", ["workflows"]);
  const isEditMode = !!initialData;
  const createMutation = workflowResource.useCreate();
  const updateMutation = workflowResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
      triggerMode: "event",
      triggerType: ActivityActionType.TASK_CREATED,
      cronExpression: "",
      enabled: true,
      actions: [],
    },
  });

  const triggerMode = useWatch({
    control: methods.control,
    name: "triggerMode",
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset({
        ...initialData,
        description: initialData.description ?? "",
        triggerMode: initialData.cronExpression ? "schedule" : "event",
      });
    }
  }, [initialData, isEditMode, methods]);

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "actions",
  });

  async function onSubmit(values: WorkflowFormValues) {
    const finalValues = {
      ...values,
      actions: values.actions.map((action: any, index: any) => ({
        ...action,
        order: index,
      })),
      triggerType: values.triggerMode === "event" ? values.triggerType : null,
      cronExpression:
        values.triggerMode === "schedule" ? values.cronExpression : null,
    };

    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: finalValues },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(finalValues, {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      });
    }
  }

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={methods.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workflow Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Notify on Task Creation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="triggerMode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>When this happens...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-y-0 space-x-2">
                    <FormControl>
                      <RadioGroupItem value="event" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      An event occurs
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0 space-x-2">
                    <FormControl>
                      <RadioGroupItem value="schedule" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      On a schedule (CRON)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {triggerMode === "event" && (
          <FormField
            control={methods.control}
            name="triggerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trigger event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ActivityActionType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {triggerMode === "schedule" && (
          <FormField
            control={methods.control}
            name="cronExpression"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CRON Expression</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 0 2 * * *"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Define when this workflow will run. e.g., '0 2 * * *' for
                  every day at 2 AM.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div>
          <h3 className="mb-2 text-sm font-medium">Do this...</h3>
          <div className="space-y-4 rounded-md border p-4">
            {fields.map((field, index) => (
              <ActionRepeater
                key={field.id}
                control={methods.control}
                index={index}
                remove={remove}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  type: WorkflowActionType.UPDATE_TASK_STATUS,
                  config: { status: TaskStatus.IN_PROGRESS },
                  order: fields.length,
                } as any)
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Action
            </Button>
          </div>
          <FormField
            control={methods.control}
            name="actions"
            render={() => <FormMessage />}
          />
        </div>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Create Workflow"}
        </Button>
      </form>
    </Form>
  );
}
