import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function deleteAnnouncement(id: string): Promise<void> {
  await api.delete(`/announcements/${id}`);
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
