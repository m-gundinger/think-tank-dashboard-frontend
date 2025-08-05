import { useApiResource } from "@/hooks/useApiResource";
import { Announcement } from "@/types";

export function useManageAnnouncements() {
  const resource = useApiResource<Announcement>("announcements", [
    "announcements",
  ]);
  return resource;
}