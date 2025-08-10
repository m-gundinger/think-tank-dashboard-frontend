import { useManageIntegrations } from "../api/useManageIntegrations";
import { useOAuth } from "@/hooks/useOAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const INTEGRATION_PROVIDERS = [
  {
    name: "Google",
    provider: "google",
    description: "Connect your Google account for seamless integration.",
    icon: Globe,
  },
];

export function IntegrationList() {
  const { openOAuthPopup } = useOAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useManageIntegrations().useGetAll();

  const handleConnect = async (provider: string) => {
    const workspaceId = "your-workspace-id";
    await openOAuthPopup(provider, workspaceId);
    queryClient.invalidateQueries({ queryKey: ["integrations"] });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (isError) return <div>Failed to load integrations.</div>;

  const connectedProviders = new Set(
    data?.data?.map((integration: any) => integration.provider)
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {INTEGRATION_PROVIDERS.map((providerInfo) => {
        const isConnected = connectedProviders.has(
          providerInfo.provider.toUpperCase()
        );
        const integrationData = data?.data?.find(
          (i: any) => i.provider === providerInfo.provider.toUpperCase()
        );
        return (
          <Card key={providerInfo.provider}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <providerInfo.icon className="h-8 w-8" />
                  <CardTitle>{providerInfo.name}</CardTitle>
                </div>
                <Switch checked={isConnected} disabled />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{providerInfo.description}</CardDescription>
              <div className="mt-4">
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reconnect
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Connected on{" "}
                      {new Date(integrationData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleConnect(providerInfo.provider)}
                    size="sm"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}