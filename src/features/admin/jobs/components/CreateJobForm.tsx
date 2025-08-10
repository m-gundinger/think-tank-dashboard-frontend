import { z } from "zod";
import { JobPriority } from "@/types/api";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormDatePicker,
} from "@/components/shared/form/FormFields";
import { useGetJobTypes } from "../api/useGetJobTypes";

const jobSchema = z.object({
  type: z.string().min(1, "Job type is required."),
  payload: z.string().optional(),
  priority: z.nativeEnum(JobPriority).optional(),
  maxAttempts: z.string().optional(),
  delay: z.string().optional(),
  scheduledAt: z.date().optional().nullable(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface CreateJobFormProps {
  onSuccess?: () => void;
  initialData?: JobFormValues;
}

export function CreateJobForm({ onSuccess, initialData }: CreateJobFormProps) {
  const { data: jobTypesData, isLoading: isLoadingJobTypes } = useGetJobTypes();

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
    <ResourceForm
      schema={jobSchema}
      resourcePath="admin/jobs"
      resourceKey={["jobs"]}
      initialData={initialData}
      onSuccess={onSuccess}
      processValues={(values) => {
        let parsedPayload = {};
        if (values.payload && values.payload.trim()) {
          try {
            parsedPayload = JSON.parse(values.payload);
          } catch (e) {
            throw new Error("Payload must be valid JSON.");
          }
        }
        return {
          ...values,
          payload: parsedPayload,
          maxAttempts: values.maxAttempts
            ? parseInt(values.maxAttempts, 10)
            : undefined,
          delay: values.delay ? parseInt(values.delay, 10) : undefined,
        };
      }}
      renderFields={() => (
        <>
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
        </>
      )}
    />
  );
}