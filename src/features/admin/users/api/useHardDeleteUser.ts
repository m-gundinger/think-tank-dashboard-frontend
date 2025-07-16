import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function hardDeleteUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}/hard`);
}

export function useHardDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: hardDeleteUser,
    onSuccess: () => {
      toast.success("User permanently deleted.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete user", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
