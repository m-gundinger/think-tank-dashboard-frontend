import { useApiResource } from "@/hooks/useApiResource";

export function useManageWhiteboards() {
  const resource = useApiResource("whiteboards", ["whiteboards"]);
  return resource;
}
