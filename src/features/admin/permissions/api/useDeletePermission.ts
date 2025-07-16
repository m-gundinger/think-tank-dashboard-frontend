import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deletePermission(permissionId: string): Promise<void> {
  await api.delete(`/admin/permissions/${permissionId}`);
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
