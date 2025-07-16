import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function triggerJobSchedule(
  scheduleId: string
): Promise<{ jobId: string }> {
  const { data } = await api.post(
    `/admin/jobs/schedules/${scheduleId}/trigger`
  );
  return data;
}

export function useTriggerJobSchedule() {
  return useMutation<any, AxiosError, string>({
    mutationFn: triggerJobSchedule,
    onSuccess: (data) => {
      toast.success("Job schedule triggered successfully.", {
        description: `New Job ID: ${data.jobId}`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to trigger schedule", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
