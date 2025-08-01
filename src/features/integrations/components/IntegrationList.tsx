import { useApiResource } from "@/hooks/useApiResource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IntegrationCategory, IntegrationProvider } from "@/types/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const INTEGRATIONS = [
  {
    provider: IntegrationProvider.GOOGLE,
    name: "Google",
    description: "Connect Google Drive, Calendar, Docs, and more.",
    category: IntegrationCategory.OAUTH,
  },
  {
    provider: IntegrationProvider.LINKEDIN,
    name: "LinkedIn",
    description: "Connect your LinkedIn account for social interactions.",
    category: IntegrationCategory.OAUTH,
  },
  {
    provider: IntegrationProvider.TWITTER,
    name: "X (Twitter)",
    description: "Connect your X account for social interactions.",
    category: IntegrationCategory.OAUTH,
  },
  {
    provider: IntegrationProvider.FACEBOOK,
    name: "Facebook",
    description: "Connect your Facebook Pages for social interactions.",
    category: IntegrationCategory.OAUTH,
  },
  {
    provider: IntegrationProvider.INSTAGRAM,
    name: "Instagram",
    description: "Connect your Instagram account.",
    category: IntegrationCategory.OAUTH,
  },
  {
    provider: IntegrationProvider.GITHUB,
    name: "GitHub",
    description: "Link GitHub repositories and issues.",
    category: IntegrationCategory.OAUTH,
  },
  {
    provider: IntegrationProvider.NEXTCLOUD,
    name: "Nextcloud",
    description: "Connect your Nextcloud instance for file management.",
    category: IntegrationCategory.API_KEY,
  },
  {
    provider: IntegrationProvider.TELEGRAM,
    name: "Telegram",
    description: "Send notifications and interact via Telegram bots.",
    category: IntegrationCategory.API_KEY,
  },
  {
    provider: IntegrationProvider.BREVO,
    name: "Brevo",
    description: "Connect your Brevo account for email services.",
    category: IntegrationCategory.API_KEY,
  },
  {
    provider: IntegrationProvider.WORDPRESS,
    name: "WordPress",
    description: "Manage and publish content to your WordPress site.",
    category: IntegrationCategory.API_KEY,
  },
  {
    provider: IntegrationProvider.CANVA,
    name: "Canva",
    description: "Create and manage designs with Canva.",
    category: IntegrationCategory.API_KEY,
  },
  {
    provider: IntegrationProvider.OPEN_ROUTER,
    name: "OpenRouter",
    description: "Leverage various AI models for generative tasks.",
    category: IntegrationCategory.API_KEY,
  },
];

export function IntegrationList() {
  const { useGetAll } = useApiResource("integrations/configurations", [
    "integrations",
  ]);
  const { data, isLoading, isError } = useGetAll();

  const handleConnect = (
    provider: IntegrationProvider,
    workspaceId: string
  ) => {
    const authUrl = `/api/v1/integrations/connect/${provider.toLowerCase()}?workspaceId=${workspaceId}`;
    const oauthWindow = window.open(
      authUrl,
      "oauth-window",
      "width=600,height=700"
    );

    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data.source === "google-oauth-callback"
      ) {
        if (event.data.status === "success") {
          toast.success(`${provider} account connected successfully!`);
        } else {
          toast.error(`Connection failed: ${event.data.message}`);
        }
        window.removeEventListener("message", handleMessage);
        oauthWindow?.close();
      }
    };

    window.addEventListener("message", handleMessage);
  };

  if (isLoading) return <Skeleton className="h-48 w-full" />;
  if (isError) return <div>Failed to load integration statuses.</div>;

  const connectedProviders = new Set(data?.data?.map((d: any) => d.provider));

  // A bit of a hack until workspace selection is global
  const workspaceId = data?.data?.[0]?.workspaceId || "default";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {INTEGRATIONS.map((integration) => {
        const isConnected = connectedProviders.has(integration.provider);
        return (
          <Card key={integration.provider}>
            <CardHeader>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                {integration.description}
              </p>
              <Button
                className="w-full"
                onClick={() => handleConnect(integration.provider, workspaceId)}
                disabled={isConnected}
              >
                {isConnected ? "Connected" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
