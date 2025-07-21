import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function markAsRead(notificationId: string): Promise<any> {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return data;
}

export function useMarkNotificationAsRead() {
  return useApiMutation({
    mutationFn: markAsRead,
    invalidateQueries: [["notifications"]],
  });
}
