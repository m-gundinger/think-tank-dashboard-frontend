import { useApiResource } from "@/hooks/useApiResource";
import { Whiteboard } from "@/types";

export function useManageWhiteboards() {
  const resource = useApiResource<Whiteboard>("whiteboards", ["whiteboards"]);
  return resource;
}