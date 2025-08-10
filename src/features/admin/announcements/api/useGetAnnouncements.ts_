import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PaginatedResponse, Announcement } from "@/types";

async function getAnnouncements(
  query: any
): Promise<PaginatedResponse<Announcement>> {
  const { data } = await api.get("announcements", { params: query });
  return data;
}

export function useGetAnnouncements(query: any) {
  return useQuery({
    queryKey: ["announcements", query],
    queryFn: () => getAnnouncements(query),
  });
}

async function getAnnouncement(id: string): Promise<Announcement> {
  const { data } = await api.get(`announcements/${id}`);
  return data;
}

export function useGetAnnouncement(id: string | null) {
  return useQuery<Announcement>({
    queryKey: ["announcement", id],
    queryFn: () => getAnnouncement(id!),

    enabled: !!id,
  });
}