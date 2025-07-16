import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function assignRoleToUser({
  userId,
  roleId,
}: {
  userId: string;
  roleId: string;
}): Promise<any> {
  const { data } = await api.post(`/admin/users/${userId}/roles`, { roleId });
  return data;
}

export function useAssignRoleToUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => assignRoleToUser({ userId, roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
}
