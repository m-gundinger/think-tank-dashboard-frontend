// FILE: src/features/admin/announcements/api/useDeleteAnnouncement.ts
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function deleteAnnouncement(ids: string | string[]): Promise<void> {
  if (Array.isArray(ids)) {
    // For bulk delete, we might use a different endpoint or request body format
    // For now, we will assume the backend can handle an array of IDs in a DELETE request body
    // or we make multiple requests. A dedicated bulk endpoint is better.
    // Let's assume a dedicated endpoint for now.
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
