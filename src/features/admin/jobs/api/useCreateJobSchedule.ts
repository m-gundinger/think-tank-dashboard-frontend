import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function createJobSchedule(scheduleData: any): Promise<any> {
  const { data } = await api.post("/admin/jobs/schedules", scheduleData);
  return data;
}

export function useCreateJobSchedule() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: createJobSchedule,
    onSuccess: () => {
      toast.success("Job schedule created successfully.");
      queryClient.invalidateQueries({ queryKey: ["jobSchedules"] });
    },
    onError: (error: any) => {
      toast.error("Failed to create schedule", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
