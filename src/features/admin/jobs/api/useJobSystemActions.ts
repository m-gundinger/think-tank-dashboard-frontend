import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function cleanupJobs(): Promise<any> {
  const { data } = await api.post("admin/jobs/system/cleanup");
  return data;
}

export function useCleanupJobs() {
  return useApiMutation({
    mutationFn: cleanupJobs,
    successMessage: (data) =>
      `Job cleanup successful. Deleted ${data.deletedJobsCount} records.`,
    invalidateQueries: [["jobs"], ["queueStats"]],
  });
}

async function emitJobStats(): Promise<any> {
  const { data } = await api.post("admin/jobs/system/emit-stats");
  return data;
}

export function useEmitJobStats() {
  return useApiMutation({
    mutationFn: emitJobStats,
    successMessage: "Job queue stats emitted over WebSocket.",
  });
}