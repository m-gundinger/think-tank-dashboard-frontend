import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function markAsRead(notificationId: string): Promise<any> {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return data;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
