import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
