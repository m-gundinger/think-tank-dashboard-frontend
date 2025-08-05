import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormDatePicker,
} from "@/components/form/FormFields";
import { useApiResource } from "@/hooks/useApiResource";
import { useGetJobTypes } from "../api/useGetJobTypes";
import { z } from "zod";
import { JobPriority } from "@/types/api";

const jobSchema = z.object({
  type: z.string().min(1, "Job type is required."),
  payload: z.string().optional(),
  priority: z.nativeEnum(JobPriority).optional(),
  maxAttempts: z.string().optional(),
  delay: z.string().optional(),
  scheduledAt: z.date().optional().nullable(),
});

type JobFormValues = z.infer<typeof jobSchema>;

// Type for the API payload after processing
interface ProcessedJobValues {
  type: string;
  payload?: any;
  priority?: JobPriority;
  maxAttempts?: number;
  delay?: number;
  scheduledAt?: Date | null;
}

interface CreateJobFormProps {
  onSuccess?: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const jobResource = useApiResource("admin/jobs", ["jobs"]);
  const createMutation = jobResource.useCreate();
  const { data: jobTypesData, isLoading: isLoadingJobTypes } = useGetJobTypes();

  const methods = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: "",
      payload: "{}",
      priority: JobPriority.NORMAL,
      maxAttempts: "3",
      delay: "0",
      scheduledAt: null,
    },
  });

  async function onSubmit(values: JobFormValues) {
    // Validate and convert numeric fields
    let maxAttempts: number | undefined;
    let delay: number | undefined;

    if (values.maxAttempts && values.maxAttempts.trim()) {
      const parsed = parseInt(values.maxAttempts, 10);
      if (isNaN(parsed) || parsed < 1) {
        methods.setError("maxAttempts", {
          type: "manual",
          message: "Must be a valid number greater than 0",
        });
        return;
      }
      maxAttempts = parsed;
    }

    if (values.delay && values.delay.trim()) {
      const parsed = parseInt(values.delay, 10);
      if (isNaN(parsed) || parsed < 0) {
        methods.setError("delay", {
          type: "manual",
          message: "Must be a valid number greater than or equal to 0",
        });
        return;
      }
      delay = parsed;
    }

    let parsedPayload = {};
    if (values.payload && values.payload.trim()) {
      try {
        parsedPayload = JSON.parse(values.payload);
      } catch (e) {
        methods.setError("payload", {
          type: "manual",
          message: "Payload must be valid JSON.",
        });
        return;
      }
    }

    const processedValues: ProcessedJobValues = {
      type: values.type,
      payload: parsedPayload,
      priority: values.priority,
      maxAttempts,
      delay,
      scheduledAt: values.scheduledAt,
    };

    await createMutation.mutateAsync(processedValues, {
      onSuccess: () => {
        methods.reset();
        onSuccess?.();
      },
    });
  }

  const jobTypeOptions =
    jobTypesData?.jobTypes.map((jobType: any) => ({
      value: jobType.type,
      label: jobType.type,
    })) || [];

  const priorityOptions = Object.values(JobPriority).map((p) => ({
    value: p,
    label: p.charAt(0) + p.slice(1).toLowerCase(),
  }));

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormSelect
            name="type"
            label="Job Type"
            placeholder={
              isLoadingJobTypes ? "Loading types..." : "Select a job type"
            }
            options={jobTypeOptions}
            disabled={isLoadingJobTypes}
          />
          <FormTextarea
            name="payload"
            label="Payload (JSON)"
            placeholder='{ "userId": "...", "force": true }'
            rows={5}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="priority"
              label="Priority"
              placeholder="Select priority"
              options={priorityOptions}
            />
            <FormInput
              name="maxAttempts"
              label="Max Attempts"
              type="number"
              placeholder="e.g., 3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="delay"
              label="Delay (ms)"
              type="number"
              placeholder="e.g., 5000"
            />
            <FormDatePicker
              name="scheduledAt"
              label="Scheduled At (Optional)"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Enqueuing..." : "Enqueue Job"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}