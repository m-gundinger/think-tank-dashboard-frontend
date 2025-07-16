import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createPublication(publicationData: any) {
  const { data } = await api.post("/publications", publicationData);
  return data;
}

export function useCreatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
    },
  });
}
