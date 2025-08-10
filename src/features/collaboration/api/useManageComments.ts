import { useApiResource } from "@/hooks/useApiResource";
import { Comment } from "@/types";

export function useManageComments(entityId: string) {
  const resource = useApiResource<Comment>(`comments`, ["comments", entityId]);

  return {
    useUpdate: resource.useUpdate,
    useDelete: resource.useDelete,
  };
}