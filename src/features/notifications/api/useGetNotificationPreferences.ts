import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getNotificationPreferences(): Promise<any> {
  const { data } = await api.get("/notifications/preferences");
  return data;
}

export function useGetNotificationPreferences() {
  return useQuery({
    queryKey: ["notificationPreferences"],
    queryFn: getNotificationPreferences,
  });
}
