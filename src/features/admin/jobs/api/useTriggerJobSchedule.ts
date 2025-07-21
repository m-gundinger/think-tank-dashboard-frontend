import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function triggerJobSchedule(
  scheduleId: string
): Promise<{ jobId: string }> {
  const { data } = await api.post(
    `/admin/jobs/schedules/${scheduleId}/trigger`
  );
  return data;
}

export function useTriggerJobSchedule() {
  return useApiMutation({
    mutationFn: triggerJobSchedule,
    successMessage: (data) =>
      `Job schedule triggered. New Job ID: ${data.jobId}`,
  });
}
