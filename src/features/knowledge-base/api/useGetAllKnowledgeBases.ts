import { useApiResource } from "@/hooks/useApiResource";

export function useGetAllKnowledgeBases() {
  const resource = useApiResource("knowledge-bases", ["knowledgeBases", "all"]);
  return resource.useGetAll();
}