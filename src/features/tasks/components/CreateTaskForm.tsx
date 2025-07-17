// FILE: src/features/tasks/components/CreateTaskForm.tsx

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
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCreateTask } from "../api/useCreateTask";
import { useCreateStandaloneTask } from "../api/useCreateStandaloneTask"; // Import new hook
import { useGetEpics } from "@/features/epics/api/useGetEpics";
import { AxiosError } from "axios";
import { TaskStatus, TaskPriority } from "@/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  epicId: z.string().nullable().optional(),
  parentId: z.string().nullable().optional(),
  boardColumnId: z.string().uuid().optional().nullable(),
  dueDate: z.date().optional().nullable(),
});
type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskFormProps {
  workspaceId?: string;
  projectId?: string;
  parentId?: string | null;
  onSuccess?: () => void;
}

export function CreateTaskForm({
  workspaceId,
  projectId,
  parentId = null,
  onSuccess,
}: CreateTaskFormProps) {
  const createTaskInProjectMutation = useCreateTask(workspaceId!, projectId!);
  const createStandaloneTaskMutation = useCreateStandaloneTask();
  const createMutation = projectId
    ? createTaskInProjectMutation
    : createStandaloneTaskMutation;

  const { data: epicsData, isLoading: isLoadingEpics } = useGetEpics(
    workspaceId!,
    projectId!
  );
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.TODO,
      priority: TaskPriority.NONE,
      epicId: null,
      parentId: parentId,
      boardColumnId: null,
      dueDate: null,
    },
  });
  async function onSubmit(values: TaskFormValues) {
    const submitData: Partial<TaskFormValues> = { ...values };
    if (!submitData.boardColumnId) delete submitData.boardColumnId;
    if (!submitData.epicId) delete submitData.epicId;
    if (!submitData.parentId) delete submitData.parentId;

    await createMutation.mutateAsync(submitData, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  }

  const errorMessage = (
    createMutation.error as AxiosError<{ message?: string }>
  )?.response?.data?.message;
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
                <Input
                  placeholder="e.g. Draft Q3 financial report"
                  {...field}
                />
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Set status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TaskStatus).map((s) => (
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Set priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TaskPriority).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {projectId && (
            <FormField
              control={form.control}
              name="epicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Epic (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value || null)}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an epic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingEpics ? (
                        <div className="text-muted-foreground p-2 text-sm">
                          Loading epics...
                        </div>
                      ) : (
                        epicsData?.data?.map((epic: any) => (
                          <SelectItem key={epic.id} value={epic.id}>
                            {epic.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {errorMessage && (
          <div className="text-sm font-medium text-red-500">{errorMessage}</div>
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
  );
}
