import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function deletePublication(id: string): Promise<void> {
  await api.delete(`/publications/${id}`);
}

export function useDeletePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePublication,
    onSuccess: () => {
      toast.success("Publication deleted.");
      queryClient.invalidateQueries({ queryKey: ["publications"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete publication", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
