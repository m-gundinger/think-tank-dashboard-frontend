import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function updateProfile(profileData: any): Promise<any> {
  const { data } = await api.put("/users/me/profile", profileData);

  return data;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error("Failed to update profile", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}