import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function deleteRole(roleId: string): Promise<void> {
  await api.delete(`/admin/roles/${roleId}`);
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success("Role deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete role", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
