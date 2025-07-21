import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function updateProfile(profileData: any): Promise<any> {
  const { data } = await api.put("/users/me/profile", profileData);

  return data;
}

export function useUpdateProfile() {
  return useApiMutation({
    mutationFn: updateProfile,
    successMessage: "Profile updated successfully!",
    invalidateQueries: [["profile"]],
  });
}
