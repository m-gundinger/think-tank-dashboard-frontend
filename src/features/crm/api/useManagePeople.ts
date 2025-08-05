import { useApiResource } from "@/hooks/useApiResource";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";
import { ListPeopleQuery, Person } from "@/types";

export function useManagePeople() {
  const resource = useApiResource<Person, ListPeopleQuery>("people", [
    "people",
  ]);

  const useBulkDelete = () => {
    return useApiMutation<{ count: number }, { ids: string[] }>({
      mutationFn: (variables) => api.delete("people", { data: variables }),
      successMessage: (data) => `${data.count} people deleted successfully.`,
      invalidateQueries: [["people"]],
    });
  };

  return {
    ...resource,
    useBulkDelete,
  };
}