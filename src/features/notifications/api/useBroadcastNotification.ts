import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function broadcastNotification(notificationData: any): Promise<any> {
  const { data } = await api.post("/notifications/broadcast", notificationData);
  return data;
}

export function useBroadcastNotification() {
  return useMutation<any, AxiosError, any>({
    mutationFn: broadcastNotification,
    onSuccess: (data) => {
      toast.success("Broadcast Sent", {
        description: `Notification sent to ${data.count} user(s).`,
      });
    },
    onError: (error: any) => {
      toast.error("Broadcast Failed", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
