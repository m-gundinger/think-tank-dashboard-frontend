import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function broadcastNotification(notificationData: any): Promise<any> {
  const { data } = await api.post("/notifications/broadcast", notificationData);
  return data;
}

export function useBroadcastNotification() {
  return useApiMutation({
    mutationFn: broadcastNotification,
    successMessage: (data) => `Broadcast sent to ${data.count} user(s).`,
  });
}