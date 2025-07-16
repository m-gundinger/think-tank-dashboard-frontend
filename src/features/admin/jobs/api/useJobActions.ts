import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function retryJob(jobId: string): Promise<any> {
  const { data } = await api.post(`/admin/jobs/${jobId}/retry`);
  return data;
}

export function useRetryJob() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, string>({
    mutationFn: retryJob,
    onSuccess: (data) => {
      toast.success("Job sent for retry.", {
        description: `Job ID: ${data.job.id}`,
      });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", data.job.id] });
    },
    onError: (error: any) => {
      toast.error("Failed to retry job", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}

async function cancelJob(jobId: string): Promise<any> {
  const { data } = await api.post(`/admin/jobs/${jobId}/cancel`);
  return data;
}

export function useCancelJob() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, string>({
    mutationFn: cancelJob,
    onSuccess: (data) => {
      toast.success("Job cancelled.", {
        description: `Job ID: ${data.job.id}`,
      });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", data.job.id] });
    },
    onError: (error: any) => {
      toast.error("Failed to cancel job", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
