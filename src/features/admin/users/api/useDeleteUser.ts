// FILE: src/features/admin/users/api/useDeleteUser.ts
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function deleteUser(userIds: string | string[]): Promise<void> {
  if (Array.isArray(userIds) && userIds.length > 0) {
    await api.delete(`/admin/users`, { data: { ids: userIds } });
  } else if (typeof userIds === "string") {
    await api.delete(`/admin/users/${userIds}`);
  }
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string | string[]>({
    mutationFn: deleteUser,
    onSuccess: (_, variables) => {
      const count = Array.isArray(variables) ? variables.length : 1;
      toast.success(`${count} user(s) successfully deactivated.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error("Failed to deactivate user(s)", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
