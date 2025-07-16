import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function deletePerson(personId: string): Promise<void> {
  await api.delete(`/people/${personId}`);
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: deletePerson,
    onSuccess: () => {
      toast.success("Person deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete person", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
