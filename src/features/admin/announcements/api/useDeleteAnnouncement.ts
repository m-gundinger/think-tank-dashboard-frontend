import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function deleteAnnouncement(ids: string | string[]): Promise<void> {
  if (Array.isArray(ids)) {
    await api.delete("/announcements", { data: { ids } });
  } else {
    await api.delete(`/announcements/${ids}`);
  }
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string | string[]>({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
