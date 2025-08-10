import { useApiResource } from "@/hooks/useApiResource";
import { Announcement } from "@/types";

interface AnnouncementQuery {
  page?: number;
}

export function useManageAnnouncements() {
  return useApiResource<Announcement, AnnouncementQuery>("announcements", [
    "announcements",
  ]);
}