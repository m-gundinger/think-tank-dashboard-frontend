import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function markAllAsRead(): Promise<any> {
  const { data } = await api.post("/notifications/mark-all-as-read");
  return data;
}

export function useMarkAllNotificationsAsRead() {
  return useApiMutation({
    mutationFn: markAllAsRead,
    invalidateQueries: [["notifications"]],
  });
}
