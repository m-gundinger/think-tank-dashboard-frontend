import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityActionType, TaskStatus, WorkflowActionType } from "@/types";
import { useCreateWorkflow } from "../api/useCreateWorkflow";
import { useUpdateWorkflow } from "../api/useUpdateWorkflow";
import { ActionRepeater } from "./ActionRepeater";
import { PlusCircle } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createTaskConfigSchema = z.object({
  title: z.string().min(1),
});

const updateTaskStatusConfigSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

const workflowActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(WorkflowActionType.CREATE_TASK),
    config: createTaskConfigSchema,
    order: z.number(),
  }),
  z.object({
    type: z.literal(WorkflowActionType.UPDATE_TASK_STATUS),
    config: updateTaskStatusConfigSchema,
    order: z.number(),
  }),
]);

const workflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required."),
  description: z.string().optional(),
  triggerType: z.nativeEnum(ActivityActionType),
  enabled: z.boolean(),
  actions: z.array(workflowActionSchema),
});

type WorkflowFormValues = z.infer<typeof workflowSchema>;

interface WorkflowFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function WorkflowForm({ initialData, onSuccess }: WorkflowFormProps) {
  const isEditMode = !!initialData;
  const createMutation = useCreateWorkflow();
  const updateMutation = useUpdateWorkflow();

  const mutation = isEditMode ? updateMutation : createMutation;
  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
      triggerType: ActivityActionType.TASK_CREATED,
      enabled: true,
      actions: [],
    },
  });
  useEffect(() => {
    if (isEditMode) {
      form.reset({
        ...initialData,
        description: initialData.description ?? "",
      });
    }
  }, [initialData, isEditMode, form]);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "actions",
  });
  async function onSubmit(values: WorkflowFormValues) {
    const finalValues = {
      ...values,
      actions: values.actions.map((action: any, index: any) => ({
        ...action,
        order: index,
      })),
    };
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { workflowId: initialData.id, data: finalValues },
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
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
          control={form.control}
          name="triggerType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>When this happens...</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <div>
          <h3 className="mb-2 text-sm font-medium">Do this...</h3>
          <div className="space-y-4 rounded-md border p-4">
            {fields.map((field, index) => (
              <ActionRepeater
                key={field.id}
                control={form.control}
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
                  type: WorkflowActionType.CREATE_TASK,
                  config: {},
                  order: fields.length,
                } as any)
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Action
            </Button>
          </div>
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
