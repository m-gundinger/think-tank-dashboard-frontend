import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function updateNotificationPreferences(
  preferencesData: any
): Promise<any> {
  const { data } = await api.put("/notifications/preferences", preferencesData);
  return data;
}

export function useUpdateNotificationPreferences() {
  return useApiMutation({
    mutationFn: updateNotificationPreferences,
    successMessage: "Notification preferences updated.",
    invalidateQueries: [["notificationPreferences"]],
  });
}
