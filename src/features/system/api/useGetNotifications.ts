import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PaginatedNotificationsResponse } from "@/types";

async function getNotifications(query?: {
  limit?: number;
  page?: number;
  isRead?: boolean;
}): Promise<PaginatedNotificationsResponse> {
  const { data } = await api.get("/notifications", { params: query });
  return data;
}

export function useGetNotifications(query: {
  limit?: number;
  page?: number;
  isRead?: boolean;
}) {
  return useQuery({
    queryKey: ["notifications", query],
    queryFn: () => getNotifications(query),
  });
}