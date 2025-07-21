import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function retryJob(jobId: string): Promise<any> {
  const { data } = await api.post(`/admin/jobs/${jobId}/retry`);
  return data;
}

export function useRetryJob() {
  return useApiMutation({
    mutationFn: retryJob,
    successMessage: (data) => `Job sent for retry. Job ID: ${data.job.id}`,
    invalidateQueries: (data) => [["jobs"], ["job", data.job.id]],
  });
}

async function cancelJob(jobId: string): Promise<any> {
  const { data } = await api.post(`/admin/jobs/${jobId}/cancel`);
  return data;
}

export function useCancelJob() {
  return useApiMutation({
    mutationFn: cancelJob,
    successMessage: (data) => `Job cancelled. Job ID: ${data.job.id}`,
    invalidateQueries: (data) => [["jobs"], ["job", data.job.id]],
  });
}
