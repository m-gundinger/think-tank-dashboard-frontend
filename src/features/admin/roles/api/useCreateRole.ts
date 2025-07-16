import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createRole(roleData: any): Promise<any> {
  const { data } = await api.post("/admin/roles", roleData);
  return data;
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
