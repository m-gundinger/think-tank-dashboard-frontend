import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormRichTextEditor,
  FormSelect,
  FormDatePicker,
  FormAssigneeSelector,
  FormTaskTypeSelector,
} from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { useGetProfile } from "@/features/profile/api/useGetProfile";
import { AxiosError } from "axios";
import { TaskStatus, TaskPriority } from "@/types/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  taskTypeId: z.string().uuid().nullable().optional(),
  epicId: z.string().nullable().optional(),
  parentId: z.string().nullable().optional(),
  boardColumnId: z.string().uuid().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  assigneeIds: z
    .array(z.string().uuid())
    .min(1, "At least one assignee is required."),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskFormProps {
  workspaceId?: string;
  projectId?: string;
  parentId?: string | null;
  onSuccess?: () => void;
  defaultValues?: Partial<TaskFormValues>;
}

export function CreateTaskForm({
  workspaceId,
  projectId,
  parentId = null,
  onSuccess,
  defaultValues,
}: CreateTaskFormProps) {
  const taskResource = useApiResource(
    projectId
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks`
      : "/tasks",
    projectId ? ["tasks", projectId] : ["myTasks"]
  );
  const epicResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/epics`,
    ["epics", projectId]
  );

  const createMutation = taskResource.useCreate();
  const { data: epicsData, isLoading: isLoadingEpics } =
    epicResource.useGetAll();
  const { data: profileData } = useGetProfile();
  const methods = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.TODO,
      priority: TaskPriority.NONE,
      taskTypeId: null,
      epicId: null,
      parentId: parentId,
      boardColumnId: null,
      dueDate: null,
      assigneeIds: [],
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (profileData && !methods.getValues("assigneeIds")?.length) {
      methods.setValue("assigneeIds", [profileData.id]);
    }
  }, [profileData, methods]);
  async function onSubmit(values: TaskFormValues) {
    const submitData: Partial<TaskFormValues> = { ...values };
    if (!submitData.boardColumnId) delete submitData.boardColumnId;
    if (!submitData.epicId) delete submitData.epicId;
    if (!submitData.parentId) delete submitData.parentId;
    if (!submitData.taskTypeId) delete submitData.taskTypeId;

    await createMutation.mutate(submitData, {
      onSuccess: () => {
        methods.reset();
        onSuccess?.();
      },
    });
  }

  const errorMessage = (
    createMutation.error as AxiosError<{ message?: string }>
  )?.response?.data?.message;
  const statusOptions = Object.values(TaskStatus).map((s) => ({
    value: s,
    label: s,
  }));
  const priorityOptions = Object.values(TaskPriority).map((p) => ({
    value: p,
    label: p,
  }));
  const epicOptions =
    epicsData?.data?.map((epic: any) => ({
      value: epic.id,
      label: epic.name,
    })) || [];

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="title"
            label="Title"
            placeholder="e.g. Draft Q3 financial report"
          />
          {projectId && workspaceId && (
            <FormTaskTypeSelector
              name="taskTypeId"
              label="Task Type"
              workspaceId={workspaceId}
              projectId={projectId}
            />
          )}
          <FormAssigneeSelector
            name="assigneeIds"
            label="Assignees"
            projectId={projectId}
            workspaceId={workspaceId}
          />
          <FormRichTextEditor name="description" label="Description" />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="status"
              label="Status"
              placeholder="Set status"
              options={statusOptions}
            />
            <FormSelect
              name="priority"
              label="Priority"
              placeholder="Set priority"
              options={priorityOptions}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {projectId && (
              <FormSelect
                name="epicId"
                label="Epic (Optional)"
                placeholder={isLoadingEpics ? "Loading..." : "Select an epic"}
                options={epicOptions}
              />
            )}
            <FormDatePicker name="dueDate" label="Due Date (Optional)" />
          </div>

          {errorMessage && (
            <div className="text-sm font-medium text-red-500">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating Task..." : "Create Task"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
