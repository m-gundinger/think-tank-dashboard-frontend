import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { SearchResults } from "@/types";

interface SearchQuery {
  q: string;
  limit?: number;
  type?: "project" | "task" | "publication" | "report" | "user";
}

async function performSearch(query: SearchQuery): Promise<SearchResults> {
  const { data } = await api.get("search", { params: query });
  return data;
}

export function useSearch(searchTerm: string, limit = 5) {
  return useQuery({
    queryKey: ["search", searchTerm, limit],
    queryFn: () => performSearch({ q: searchTerm, limit }),

    enabled: searchTerm.length > 1,
  });
}