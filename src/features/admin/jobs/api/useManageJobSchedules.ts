import { useApiResource } from "@/hooks/useApiResource";
import { JobSchedule } from "@/types";

export function useManageJobSchedules() {
  return useApiResource<JobSchedule>("admin/jobs/schedules", ["jobSchedules"]);
}