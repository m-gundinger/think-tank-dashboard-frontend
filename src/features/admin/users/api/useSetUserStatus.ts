import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface SetStatusParams {
  userId: string;
  isActive: boolean;
}

async function setUserStatus({
  userId,
  isActive,
}: SetStatusParams): Promise<any> {
  const { data } = await api.patch(`/admin/users/${userId}/status`, {
    isActive,
  });
  return data;
}

export function useSetUserStatus() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, SetStatusParams>({
    mutationFn: setUserStatus,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<any>(["users"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((user: any) =>
            user.id === updatedUser.id ? updatedUser : user
          ),
        };
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
  });
}
