import { ChangePasswordForm } from "@/features/security/components/ChangePasswordForm";
import { NotificationPreferencesForm } from "@/features/notifications/components/NotificationPreferencesForm";
export function AccountSettingsPage() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <ChangePasswordForm />
      <NotificationPreferencesForm />
    </div>
  );
}
