import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function hardDeleteUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}/hard`);
}

export function useHardDeleteUser() {
  return useApiMutation({
    mutationFn: hardDeleteUser,
    successMessage: "User permanently deleted.",
    invalidateQueries: [["users"]],
  });
}