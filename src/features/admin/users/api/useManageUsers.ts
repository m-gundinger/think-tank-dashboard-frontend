import { useApiResource } from "@/hooks/useApiResource";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";
import { ListPeopleQuery, User } from "@/types";

export function useManageUsers() {
  const resource = useApiResource<User, ListPeopleQuery>("admin/users", [
    "users",
  ]);

  const useBulkDelete = () => {
    return useApiMutation<{ count: number }, { ids: string[] }>({
      mutationFn: (variables) => api.delete("admin/users", { data: variables }),
      successMessage: (data) => `${data.count} users deactivated successfully.`,
      invalidateQueries: [["users"]],
    });
  };

  return {
    ...resource,
    useBulkDelete,
  };
}