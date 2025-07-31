import { useState } from "react";
import { IntegrationProvider } from "@/types/api";
import { useApiResource } from "@/hooks/useApiResource";
import { IntegrationCard } from "./IntegrationCard";
import { IntegrationConnectionDialog } from "./IntegrationConnectionDialog";

export function IntegrationList() {
  const [selectedProvider, setSelectedProvider] =
    useState<IntegrationProvider | null>(null);
  const { data: integrations, isLoading } = useApiResource(
    "integrations/configurations",
    ["integrations"]
  ).useGetAll();
  const { useDelete } = useApiResource("integrations/configurations", [
    "integrations",
  ]);
  const deleteMutation = useDelete();

  const connectedProviders = new Set(
    integrations?.data?.map((i: any) => i.provider)
  );

  const handleConnect = (provider: IntegrationProvider) => {
    setSelectedProvider(provider);
  };

  const handleDisconnect = (provider: IntegrationProvider) => {
    const integration = integrations?.data.find(
      (i: any) => i.provider === provider
    );
    if (integration && window.confirm(`Disconnect from ${provider}?`)) {
      deleteMutation.mutate(integration.id);
    }
  };

  if (isLoading) return <div>Loading integrations...</div>;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.values(IntegrationProvider).map((provider) => (
          <IntegrationCard
            key={provider}
            provider={provider}
            isConnected={connectedProviders.has(provider)}
            onConnect={() => handleConnect(provider)}
            onDisconnect={() => handleDisconnect(provider)}
          />
        ))}
      </div>
      <IntegrationConnectionDialog
        isOpen={!!selectedProvider}
        onOpenChange={(isOpen) => !isOpen && setSelectedProvider(null)}
        provider={selectedProvider}
        workspaceId={"<WORKSPACE_ID>"} // This needs to be dynamically sourced
      />
    </>
  );
}
