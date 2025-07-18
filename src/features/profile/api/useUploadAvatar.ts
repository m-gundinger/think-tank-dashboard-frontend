import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function uploadAvatar(formData: FormData): Promise<any> {
  try {
    const { data } = await api.patch("/users/me/avatar", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return data;
  } catch (error: any) {
    throw error;
  }
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      toast.success("Avatar updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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
