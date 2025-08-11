import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface SetStatusParams {
  userId: string;
  isActive: boolean;
}

async function setUserStatus({
  userId,
  isActive,
}: SetStatusParams): Promise<any> {
  const { data } = await api.patch(`admin/users/${userId}/status`, {
    isActive,
  });
  return data;
}

export function useSetUserStatus() {
  return useApiMutation<any, SetStatusParams>({
    mutationFn: setUserStatus,
    successMessage: (data) =>
      `User ${data.person.firstName} has been ${
        data.isActive ? "activated" : "deactivated"
      }.`,
    invalidateQueries: (data) => [["users"], ["user", data.id]],
  });
}