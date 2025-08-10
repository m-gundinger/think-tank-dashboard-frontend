import { useState } from "react";
import {
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
import { ActionRepeater } from "./ActionRepeater";
import { PlusCircle } from "lucide-react";
import { z } from "zod";
import { Workflow } from "@/types";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";

const createTaskConfigSchema = z.object({
  title: z.string().min(1),
});

const updateTaskStatusConfigSchema = z.object({
  status: z.nativeEnum(TaskStatus),
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

export const SendWebhookActionConfigSchema = z.object({
  url: z.string().url(),
  body: z.record(z.string(), z.any()),
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
    type: z.literal(WorkflowActionType.SEND_WEBHOOK),
    config: SendWebhookActionConfigSchema,
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
    triggerType: z.nativeEnum(ActivityActionType).optional().nullable(),
    cronExpression: z.string().optional().nullable(),
    enabled: z.boolean(),
    actions: z.array(workflowActionSchema),
  })
  .refine(
    (data) => {
      if (data.cronExpression) {
        return !data.triggerType;
      }
      return !!data.triggerType;
    },
    {
      message:
        "Either an event trigger or a CRON schedule must be defined, but not both.",
      path: ["triggerType"],
    }
  );

interface WorkflowFormProps {
  initialData?: Workflow;
  onSuccess?: () => void;
}

export function WorkflowForm({ initialData, onSuccess }: WorkflowFormProps) {
  const [triggerMode, setTriggerMode] = useState(
    initialData?.cronExpression ? "schedule" : "event"
  );

  const processedInitialData = initialData
    ? {
        ...initialData,
        description: initialData.description ?? "",
        actions: initialData.actions as any[],
      }
    : {
        name: "",
        description: "",
        triggerType: ActivityActionType.TASK_CREATED,
        cronExpression: "",
        enabled: true,
        actions: [],
      };

  return (
    <ResourceForm
      schema={workflowSchema}
      resourcePath="admin/workflows"
      resourceKey={["workflows"]}
      initialData={processedInitialData}
      onSuccess={onSuccess}
      processValues={(values) => ({
        ...values,
        actions: values.actions.map((action, index) => ({
          ...action,
          order: index,
        })),
        triggerType: triggerMode === "event" ? values.triggerType : null,
        cronExpression:
          triggerMode === "schedule" ? values.cronExpression : null,
      })}
      className="space-y-6"
      renderFields={({ control }) => (
        <WorkflowFormFields
          control={control}
          triggerMode={triggerMode}
          setTriggerMode={setTriggerMode}
        />
      )}
    />
  );
}

const WorkflowFormFields = ({
  control,
  triggerMode,
  setTriggerMode,
}: {
  control: any;
  triggerMode: string;
  setTriggerMode: (mode: string) => void;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "actions",
  });

  return (
    <>
      <FormField
        control={control}
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

      <FormItem className="space-y-3">
        <FormLabel>When this happens...</FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={setTriggerMode}
            defaultValue={triggerMode}
            className="flex items-center space-x-4"
          >
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <RadioGroupItem value="event" />
              </FormControl>
              <FormLabel className="font-normal">An event occurs</FormLabel>
            </FormItem>
            <FormItem className="flex items-center space-x-2 space-y-0">
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

      {triggerMode === "event" && (
        <FormField
          control={control}
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
          control={control}
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
                Define when this workflow will run. e.g., '0 2 * * *' for every
                day at 2 AM.
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
              control={control}
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
          control={control}
          name="actions"
          render={() => <FormMessage />}
        />
      </div>
    </>
  );
};
