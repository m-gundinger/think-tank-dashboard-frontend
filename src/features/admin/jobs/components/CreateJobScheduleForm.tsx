import {
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
import { useGetJobTypes } from "../api/useGetJobTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobSchedule } from "@/types";
import { ResourceForm } from "@/components/form/ResourceForm";

const JobScheduleFormSchema = z.object({
  name: z.string().min(1, "Schedule name is required."),
  jobType: z.string().min(1, "Job type is required."),
  cronExpression: z.string().min(1, "A valid CRON expression is required."),
  payload: z.string(),
  isActive: z.boolean(),
});

interface CreateJobScheduleFormProps {
  onSuccess?: () => void;
  initialData?: JobSchedule;
}

export function CreateJobScheduleForm({
  onSuccess,
  initialData,
}: CreateJobScheduleFormProps) {
  const { data: jobTypesData, isLoading: isLoadingJobTypes } = useGetJobTypes();

  const processedInitialData = initialData
    ? {
        ...initialData,
        payload: JSON.stringify(initialData.payload, null, 2),
      }
    : {
        name: "",
        jobType: "",
        cronExpression: "",
        payload: "{}",
        isActive: true,
      };

  return (
    <ResourceForm
      schema={JobScheduleFormSchema}
      resourcePath="admin/jobs/schedules"
      resourceKey={["jobSchedules"]}
      initialData={processedInitialData}
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
        };
      }}
      renderFields={({ control }) => (
        <>
          <FormField
            control={control}
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
            control={control}
            name="jobType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            control={control}
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
            control={control}
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
            control={control}
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
        </>
      )}
    />
  );
}
