import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function createPublication(publicationData: any) {
  const { data } = await api.post("/publications", publicationData);
  return data;
}

export function useCreatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPublication,
    onSuccess: () => {
      toast.success("Publication created successfully.");
      queryClient.invalidateQueries({ queryKey: ["publications"] });
    },
    onError: (error: any) => {
      toast.error("Failed to create publication", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
