import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function updateNotificationPreferences(
  preferencesData: any
): Promise<any> {
  const { data } = await api.put("/notifications/preferences", preferencesData);
  return data;
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: updateNotificationPreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(["notificationPreferences"], data);
      toast.success("Notification preferences updated.");
    },
    onError: (error: any) => {
      toast.error("Failed to update preferences", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
