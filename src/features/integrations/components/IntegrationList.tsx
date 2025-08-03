import { useState } from "react";
import { Globe, MessageSquare } from "lucide-react";
import { IntegrationCard } from "./IntegrationCard";
import { useGetUserConnections } from "../api/useGetUserConnections";
import { useOAuth } from "@/hooks/useOAuth";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfile } from "@/features/profile/api/useGetProfile";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { IntegrationForm } from "./IntegrationForm";
import { useManageIntegrations } from "../api/useManageIntegrations";

const availableOAuthIntegrations = [
  {
    provider: "google",
    name: "Google",
    description: "Connect Google Drive, Calendar, and more.",
    icon: Globe,
  },
  {
    provider: "linkedin",
    name: "LinkedIn",
    description: "Connect your LinkedIn account.",
    icon: Globe,
  },
];

const ListSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {Array.from({ length: 2 }).map((_, i) => (
      <Skeleton key={i} className="h-40 w-full" />
    ))}
  </div>
);

export function IntegrationList() {
  const { data: profile } = useGetProfile();
  const { data: connections, isLoading, refetch } = useGetUserConnections();
  const { data: configuredIntegrations } = useManageIntegrations(
    profile?.workspaceId
  ).useGetAll({ enabled: !!profile?.workspaceId });
  const { openOAuthPopup } = useOAuth();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const disconnectMutation = useApiMutation({
    mutationFn: (provider: string) =>
      api.delete(`/users/me/connections/${provider}`),
    successMessage: "Integration disconnected successfully.",
    onSuccess: () => {
      refetch();
    },
  });

  const handleConnect = async (provider: string) => {
    if (!profile?.workspaceId) return;
    setIsConnecting(provider);
    try {
      await openOAuthPopup(provider, profile.workspaceId);
      await refetch();
    } finally {
      setIsConnecting(null);
    }
  };

  if (isLoading) {
    return <ListSkeleton />;
  }

  const connectedProviders = new Set(connections?.map((c) => c.provider));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Personal Connections</h3>
        <p className="text-muted-foreground text-sm">
          Connect your personal accounts to enable integrations.
        </p>
        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
          {availableOAuthIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.provider}
              name={integration.name}
              description={integration.description}
              icon={integration.icon}
              isConnected={connectedProviders.has(
                integration.provider.toUpperCase()
              )}
              isConnecting={isConnecting === integration.provider}
              onConnect={() => handleConnect(integration.provider)}
              onDisconnect={() =>
                disconnectMutation.mutate(integration.provider)
              }
            />
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Workspace Integrations</h3>
            <p className="text-muted-foreground text-sm">
              Configure API-key based integrations for your workspace.
            </p>
          </div>
          <ResourceCrudDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            trigger={
              <Button
                onClick={() => setIsCreateOpen(true)}
                size="sm"
                disabled={!profile?.workspaceId}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Integration
              </Button>
            }
            title="Configure New Integration"
            description="Set up a new API key-based integration for this workspace."
            form={IntegrationForm}
            formProps={{ workspaceId: profile?.workspaceId }}
            resourcePath="integrations"
            resourceKey={["integrations", profile?.workspaceId]}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
          {configuredIntegrations?.data.map((integration: any) => (
            <IntegrationCard
              key={integration.id}
              name={integration.friendlyName}
              description={`Provider: ${integration.provider}`}
              icon={MessageSquare}
              isConnected={integration.isActive}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
