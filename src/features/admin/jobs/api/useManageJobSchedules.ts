import { useApiResource } from "@/hooks/useApiResource";
import { JobSchedule } from "@/types";

export function useManageJobSchedules() {
  const resource = useApiResource<JobSchedule>("admin/jobs/schedules", [
    "jobSchedules",
  ]);
  return resource;
}