import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateParams {
  id: string;
  data: any;
}

async function updatePublication({ id, data }: UpdateParams): Promise<any> {
  const response = await api.put(`/publications/${id}`, data);
  return response.data;
}

export function useUpdatePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePublication,
    onSuccess: (data) => {
      toast.success("Publication updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      queryClient.setQueryData(["publication", data.id], data);
    },
    onError: (error: any) => {
      toast.error("Failed to update publication", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
