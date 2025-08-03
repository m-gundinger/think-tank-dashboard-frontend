import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function uploadAvatar(formData: FormData): Promise<any> {
  const { data } = await api.patch("users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export function useUploadAvatar() {
  return useApiMutation({
    mutationFn: uploadAvatar,
    successMessage: "Avatar updated successfully!",
    invalidateQueries: [["profile"]],
  });
}