import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function retryJob(jobId: string): Promise<any> {
  const { data } = await api.post(`admin/jobs/${jobId}/retry`);
  return data;
}

export function useRetryJob() {
  return useApiMutation({
    mutationFn: retryJob,
    successMessage: (data) => `Job sent for retry. Job ID: ${data.job.id}`,
    invalidateQueries: (data) => [["jobs"], ["job", data.job.id]],
  });
}