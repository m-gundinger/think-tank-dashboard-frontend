import { useApiResource } from "@/hooks/useApiResource";

export function useGetAllKnowledgeBases() {
  // Assuming a global endpoint /knowledge-bases/all exists for this
  const resource = useApiResource("/knowledge-bases/all", [
    "knowledgeBases",
    "all",
  ]);
  return resource.useGetAll();
}
