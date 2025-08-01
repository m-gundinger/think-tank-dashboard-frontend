import { useApiResource } from "@/hooks/useApiResource";

export function useManagePeople() {
  const resource = useApiResource("people", ["people"]);
  return resource;
}