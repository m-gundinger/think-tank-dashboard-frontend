// FILE: src/features/admin/users/api/useAdminUploadAvatar.ts
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function uploadAvatar(userId: string, formData: FormData): Promise<any> {
  const { data } = await api.patch(`/admin/users/${userId}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export function useAdminUploadAvatar(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadAvatar(userId, formData),
    onSuccess: () => {
      toast.success("Avatar updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error: any) => {
      toast.error("Failed to upload avatar", {
        description:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
      });
    },
  });
}
