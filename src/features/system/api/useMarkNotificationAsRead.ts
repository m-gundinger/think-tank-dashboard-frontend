import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Notification } from "@/types";
async function markAsRead(notificationId: string): Promise<Notification> {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return data;
}

export function useMarkNotificationAsRead() {
  return useApiMutation({
    mutationFn: markAsRead,
    invalidateQueries: [["notifications"]],
  });
}