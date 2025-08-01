import { useApiResource } from "@/hooks/useApiResource";

export function useManageAnnouncements() {
  const resource = useApiResource("announcements", ["announcements"]);
  return resource;
}