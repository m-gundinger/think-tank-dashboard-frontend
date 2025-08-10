import { useQuery } from "@tanstack/react-query";

async function getIntegrationsStatus(): Promise<any[]> {
  const mockIntegrations = [
    {
      provider: "GOOGLE",
      isConnected: true,
      connectUrl: "/api/v1/google/auth",
    },
    {
      provider: "LINKEDIN",
      isConnected: false,
      connectUrl: "/api/v1/linkedin/auth",
    },
    {
      provider: "NEXTCLOUD",
      isConnected: false,
      connectUrl: "/api/v1/nextcloud/auth",
    },
  ];
  return Promise.resolve(mockIntegrations);
}

export function useGetIntegrations() {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: getIntegrationsStatus,
    staleTime: Infinity,
  });
}
