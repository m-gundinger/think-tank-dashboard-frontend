import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface UpdateParams {
  scheduleId: string;
  data: { isActive: boolean };
}

async function updateJobSchedule({ scheduleId, data }: UpdateParams) {
  const response = await api.put(`/admin/jobs/schedules/${scheduleId}`, data);
  return response.data;
}

export function useUpdateJobSchedule() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, UpdateParams>({
    mutationFn: updateJobSchedule,
    onSuccess: () => {
      toast.success("Job schedule updated.");
      queryClient.invalidateQueries({ queryKey: ["jobSchedules"] });
    },
    onError: (error: any) => {
      toast.error("Failed to update schedule", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}

async function deleteJobSchedule(scheduleId: string) {
  await api.delete(`/admin/jobs/schedules/${scheduleId}`);
}

export function useDeleteJobSchedule() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteJobSchedule,
    onSuccess: () => {
      toast.success("Job schedule deleted.");
      queryClient.invalidateQueries({ queryKey: ["jobSchedules"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete schedule", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
