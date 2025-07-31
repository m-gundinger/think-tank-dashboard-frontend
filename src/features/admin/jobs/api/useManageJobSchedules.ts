import { useApiResource } from "@/hooks/useApiResource";

export function useManageJobSchedules() {
  const resource = useApiResource("admin/jobs/schedules", ["jobSchedules"]);
  return resource;
}
