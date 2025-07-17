// FILE: src/features/crm/api/useDeletePerson.ts
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function deletePerson(ids: string | string[]): Promise<void> {
  if (Array.isArray(ids)) {
    await api.delete(`/people`, { data: { ids } });
  } else {
    await api.delete(`/people/${ids}`);
  }
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string | string[]>({
    mutationFn: deletePerson,
    onSuccess: (_, variables) => {
      const count = Array.isArray(variables) ? variables.length : 1;
      toast.success(`${count} person(s) deleted successfully.`);
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
