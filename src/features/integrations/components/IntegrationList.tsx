import { Mail, Calendar, Box } from "lucide-react";
import { IntegrationCard } from "./IntegrationCard";

export function IntegrationList() {
  const handleGoogleConnect = () => {
    alert("Connecting to Google...");
  };

  const handleNextcloudConnect = () => {
    alert("Connecting to Nextcloud...");
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <IntegrationCard
        icon={<Mail className="h-6 w-6" />}
        title="Google Mail"
        description="Connect your Gmail account to send emails and notifications directly."
        isConnected={true}
        onConnect={handleGoogleConnect}
        onDisconnect={() => alert("Disconnecting from Google...")}
      />
      <IntegrationCard
        icon={<Calendar className="h-6 w-6" />}
        title="Google Calendar"
        description="Enable two-way sync for tasks with due dates."
        isConnected={false}
        onConnect={() => alert("Connecting to Google Calendar...")}
      />
      <IntegrationCard
        icon={<Box className="h-6 w-6" />}
        title="Nextcloud"
        description="Link and manage files from your Nextcloud instance."
        isConnected={false}
        onConnect={handleNextcloudConnect}
      />
    </div>
  );
}
