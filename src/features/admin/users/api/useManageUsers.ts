import { useApiResource } from "@/hooks/useApiResource";
import { User } from "@/types";

export function useManageUsers() {
  const resource = useApiResource<User>("admin/users", ["users"]);
  return resource;
}