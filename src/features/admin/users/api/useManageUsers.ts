import { useApiResource } from "@/hooks/useApiResource";
import { User, ListPeopleQuery } from "@/types";

export function useManageUsers() {
  const resource = useApiResource<User, ListPeopleQuery>("admin/users", [
    "users",
  ]);
  return resource;
}