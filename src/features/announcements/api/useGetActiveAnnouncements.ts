import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getActiveAnnouncements(): Promise<any[]> {
  const { data } = await api.get("/announcements/active");
  return data;
}

export function useGetActiveAnnouncements() {
  return useQuery({
    queryKey: ["activeAnnouncements"],
    queryFn: getActiveAnnouncements,

    staleTime: 1000 * 60 * 5,
  });
}
