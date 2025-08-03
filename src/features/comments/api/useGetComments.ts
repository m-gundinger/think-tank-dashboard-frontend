import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getComments(
  entityId: string,
  entityType: "TASK" // Can be expanded later
): Promise<any> {
  const { data } = await api.get("/comments", {
    params: { entityId, entityType },
  });
  return data;
}

export function useGetComments(entityId: string, entityType: "TASK") {
  return useQuery({
    queryKey: ["comments", entityId],
    queryFn: () => getComments(entityId, entityType),
    enabled: !!entityId,
  });
}