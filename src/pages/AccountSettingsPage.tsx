import { ChangePasswordForm } from "@/features/user-management/components/ChangePasswordForm";
import { NotificationPreferencesForm } from "@/features/system/components/NotificationPreferencesForm";

export function AccountSettingsPage() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <ChangePasswordForm />
      <NotificationPreferencesForm />
    </div>
  );
}