import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateProfile(profileData: any): Promise<any> {
  const { data } = await api.patch("/users/me/profile", profileData);
  return data;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
