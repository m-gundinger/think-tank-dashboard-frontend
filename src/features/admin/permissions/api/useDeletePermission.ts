import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deletePermission(ids: string | string[]): Promise<void> {
  if (Array.isArray(ids)) {
    await api.delete(`/admin/permissions`, { data: { ids } });
  } else {
    await api.delete(`/admin/permissions/${ids}`);
  }
}

export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}
