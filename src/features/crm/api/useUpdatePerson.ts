import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface UpdateParams {
  personId: string;
  data: any;
}

async function updatePerson({ personId, data }: UpdateParams): Promise<any> {
  const response = await api.put(`/people/${personId}`, data);
  return response.data;
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, UpdateParams>({
    mutationFn: updatePerson,
    onSuccess: (data) => {
      toast.success("Person updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.setQueryData(["person", data.id], data);
    },
    onError: (error: any) => {
      toast.error("Failed to update person", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
