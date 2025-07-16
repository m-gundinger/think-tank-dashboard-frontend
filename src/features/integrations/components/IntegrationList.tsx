import { useEffect } from "react";
import { useGetIntegrations } from "../api/useGetIntegrations";
import { useDisconnectIntegration } from "../api/useDisconnectIntegration";
import { IntegrationCard } from "./IntegrationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Cloud, Bot } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case "GOOGLE":
      return <Link className="h-6 w-6" />;
    case "NEXTCLOUD":
      return <Cloud className="h-6 w-6" />;
    default:
      return <Bot className="h-6 w-6" />;
  }
};

export function IntegrationList() {
  const queryClient = useQueryClient();
  const { data: integrations, isLoading } = useGetIntegrations();
  const disconnectMutation = useDisconnectIntegration();

  useEffect(() => {
    const handleAuthCallback = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.source === "google-oauth-callback"
      ) {
        if (event.data.status === "success") {
          queryClient.invalidateQueries({ queryKey: ["integrations"] });
        }
      }
    };

    window.addEventListener("message", handleAuthCallback);
    return () => {
      window.removeEventListener("message", handleAuthCallback);
    };
  }, [queryClient]);

  const handleConnect = (connectUrl: string) => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      `http://localhost:3000${connectUrl}`,
      "oauth-popup",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[160px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {integrations?.map((integration: any) => (
        <IntegrationCard
          key={integration.provider}
          name={integration.provider}
          description={`Connect your ${integration.provider} account.`}
          icon={getProviderIcon(integration.provider)}
          isConnected={integration.isConnected}
          onConnect={() => handleConnect(integration.connectUrl)}
          onDisconnect={() => disconnectMutation.mutate(integration.provider)}
          isPending={disconnectMutation.isPending}
        />
      ))}
    </div>
  );
}
