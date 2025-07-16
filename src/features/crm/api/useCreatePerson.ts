import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function createPerson(personData: any): Promise<any> {
  const { data } = await api.post("/people", personData);
  return data;
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: createPerson,
    onSuccess: () => {
      toast.success("Person created successfully.");
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
    onError: (error: any) => {
      toast.error("Failed to create person", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
