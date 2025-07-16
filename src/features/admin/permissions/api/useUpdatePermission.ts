import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updatePermission({
  permissionId,
  permissionData,
}: {
  permissionId: string;
  permissionData: any;
}): Promise<any> {
  const { data } = await api.put(
    `/admin/permissions/${permissionId}`,
    permissionData
  );
  return data;
}

export function useUpdatePermission(permissionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (permissionData: any) =>
      updatePermission({ permissionId, permissionData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}
