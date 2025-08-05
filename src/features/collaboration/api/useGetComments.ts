import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PaginatedResponse, Comment } from "@/types";

interface CommentQuery {
  page?: number;
  limit?: number;
}

async function getComments(
  entityId: string,
  entityType: "Project" | "Task",
  query?: CommentQuery
): Promise<PaginatedResponse<Comment>> {
  const entityPath = entityType === "Project" ? "projects" : "tasks";

  const { data } = await api.get(`${entityPath}/${entityId}/comments`, {
    params: query,
  });
  return data;
}

export function useGetComments(
  entityId: string,
  entityType: "Project" | "Task",
  query?: CommentQuery
) {
  return useQuery<PaginatedResponse<Comment>>({
    queryKey: ["comments", entityId, query],
    queryFn: () => getComments(entityId, entityType, query),
    enabled: !!entityId,
  });
}