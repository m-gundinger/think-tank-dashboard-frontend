import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function uploadAvatar(userId: string, formData: FormData): Promise<any> {
  const { data } = await api.patch(`/admin/users/${userId}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export function useAdminUploadAvatar(userId: string) {
  return useApiMutation({
    mutationFn: (formData: FormData) => uploadAvatar(userId, formData),
    successMessage: "Avatar updated successfully!",
    invalidateQueries: [["users"], ["user", userId]],
  });
}
