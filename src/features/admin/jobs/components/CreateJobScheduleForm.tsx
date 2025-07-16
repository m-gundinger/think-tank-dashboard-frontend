import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { useCreateJobSchedule } from "../api/useCreateJobSchedule";
import { useGetJobTypes } from "../api/useGetJobTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobScheduleFormSchema = z.object({
  name: z.string().min(1, "Schedule name is required."),
  jobType: z.string().min(1, "Job type is required."),
  cronExpression: z.string().min(1, "A valid CRON expression is required."),
  payload: z.string(),
  isActive: z.boolean(),
});

type JobScheduleFormValues = {
  name: string;
  jobType: string;
  cronExpression: string;
  payload: string;
  isActive: boolean;
};

interface CreateJobScheduleFormProps {
  onSuccess?: () => void;
}

export function CreateJobScheduleForm({
  onSuccess,
}: CreateJobScheduleFormProps) {
  const createMutation = useCreateJobSchedule();
  const { data: jobTypesData, isLoading: isLoadingJobTypes } = useGetJobTypes();

  const form = useForm<JobScheduleFormValues>({
    resolver: zodResolver(JobScheduleFormSchema),
    defaultValues: {
      name: "",
      jobType: "",
      cronExpression: "",
      payload: "",
      isActive: true,
    },
  });

  async function onSubmit(values: JobScheduleFormValues) {
    let parsedPayload = {};
    if (values.payload && values.payload.trim()) {
      try {
        parsedPayload = JSON.parse(values.payload);
      } catch (e) {
        form.setError("payload", {
          type: "manual",
          message: "Payload must be valid JSON",
        });
        return;
      }
    }

    const submitData = {
      ...values,
      payload: parsedPayload,
    };

    await createMutation.mutateAsync(submitData, {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Daily Cleanup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoadingJobTypes}>
                    <SelectValue placeholder="Select a job type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jobTypesData?.jobTypes.map((jobType: any) => (
                    <SelectItem key={jobType.type} value={jobType.type}>
                      {jobType.type}
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
          name="cronExpression"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CRON Expression</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 0 2 * * *" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payload"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payload (JSON)</FormLabel>
              <FormControl>
                <Textarea placeholder='{ "days": 7 }' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <FormLabel>Active</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create Schedule"}
        </Button>
      </form>
    </Form>
  );
}
