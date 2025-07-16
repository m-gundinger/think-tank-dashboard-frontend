import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function createUser(newUserData: any): Promise<any> {
  const { data } = await api.post("/admin/users", newUserData);
  return data;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, any>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
