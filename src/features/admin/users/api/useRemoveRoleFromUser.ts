import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function removeRoleFromUser({
  userId,
  roleId,
}: {
  userId: string;
  roleId: string;
}): Promise<any> {
  await api.delete(`/admin/users/${userId}/roles/${roleId}`);
}

export function useRemoveRoleFromUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => removeRoleFromUser({ userId, roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
}
