import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateRole({
  roleId,
  roleData,
}: {
  roleId: string;
  roleData: any;
}): Promise<any> {
  const { data } = await api.put(`/admin/roles/${roleId}`, roleData);
  return data;
}

export function useUpdateRole(roleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleData: any) => updateRole({ roleId, roleData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", roleId] });
    },
  });
}
