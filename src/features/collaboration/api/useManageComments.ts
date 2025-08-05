import { useApiResource } from "@/hooks/useApiResource";
import { Comment } from "@/types";

export function useManageComments(entityId: string) {
  const resource = useApiResource<Comment>(`comments`, ["comments", entityId]);
  // Create is handled separately in CommentSection
  return {
    useUpdate: resource.useUpdate,
    useDelete: resource.useDelete,
  };
}
