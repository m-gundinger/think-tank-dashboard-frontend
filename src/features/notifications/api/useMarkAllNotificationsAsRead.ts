import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function markAllAsRead(): Promise<any> {
  const { data } = await api.post("/notifications/mark-all-as-read");
  return data;
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
