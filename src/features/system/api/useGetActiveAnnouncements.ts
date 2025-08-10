import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Announcement } from "@/types";

async function getActiveAnnouncements(): Promise<Announcement[]> {
  const { data } = await api.get("announcements/active");
  return data;
}

export function useGetActiveAnnouncements() {
  return useQuery({
    queryKey: ["activeAnnouncements"],
    queryFn: getActiveAnnouncements,
    staleTime: 1000 * 60 * 5,
  });
}