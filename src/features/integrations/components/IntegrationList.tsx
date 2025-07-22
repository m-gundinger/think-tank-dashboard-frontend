// FILE: src/features/integrations/components/IntegrationList.tsx
import { IntegrationCard } from "./IntegrationCard";

// Mock data, this would come from an API
const availableIntegrations = [
  {
    name: "Google",
    description:
      "Connect your Google account for Calendar and Drive integrations.",
    logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
  },
  {
    name: "Slack",
    description: "Receive notifications and create tasks directly from Slack.",
    logo: "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png",
  },
];

export function IntegrationList() {
  // Mock state, this would be managed via React Query and API state
  const connectedIntegrations = new Set(["Slack"]);
  const isConnecting = false;

  const handleConnect = (name: string) => {
    alert(`Connecting to ${name}...`);
  };

  const handleDisconnect = (name: string) => {
    alert(`Disconnecting from ${name}...`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {availableIntegrations.map((integration) => (
        <IntegrationCard
          key={integration.name}
          integration={{
            ...integration,
            isConnected: connectedIntegrations.has(integration.name),
          }}
          onConnect={() => handleConnect(integration.name)}
          onDisconnect={() => handleDisconnect(integration.name)}
          isConnecting={isConnecting}
        />
      ))}
    </div>
  );
}
