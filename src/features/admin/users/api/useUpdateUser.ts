import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function updateUser({
  userId,
  userData,
}: {
  userId: string;
  userData: any;
}): Promise<any> {
  const { data } = await api.put(`/admin/users/${userId}`, userData);
  return data;
}

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, any>({
    mutationFn: (userData) => updateUser({ userId, userData }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
    },
  });
}
