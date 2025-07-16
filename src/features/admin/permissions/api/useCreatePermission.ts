import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createPermission(permissionData: any): Promise<any> {
  const { data } = await api.post("/admin/permissions", permissionData);
  return data;
}

export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}
