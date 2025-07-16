import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface GetPublicationsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export const getPublications = async (query: GetPublicationsQuery) => {
  const { data } = await api.get("/publications", { params: query });
  return data;
};

export const useGetPublications = (query: GetPublicationsQuery) => {
  return useQuery({
    queryKey: ["publications", query],
    queryFn: () => getPublications(query),
  });
};
