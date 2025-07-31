import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";
import { toast } from "sonner";

interface ConnectUrlResponse {
  authorizationUrl: string;
}

async function getConnectUrl(
  provider: string,
  workspaceId: string
): Promise<ConnectUrlResponse> {
  const { data } = await api.get(`/integrations/connect/${provider}`, {
    params: { workspaceId },
  });
  return data;
}

export function useConnectIntegration() {
  return useApiMutation<
    ConnectUrlResponse,
    { provider: string; workspaceId: string }
  >({
    mutationFn: ({ provider, workspaceId }) =>
      getConnectUrl(provider, workspaceId),
    onSuccess: (data) => {
      const popup = window.open(
        data.authorizationUrl,
        "oauth-connect",
        "width=600,height=700"
      );

      const handleMessage = (event: MessageEvent) => {
        if (
          event.origin === window.location.origin &&
          event.data?.source === "google-oauth-callback"
        ) {
          if (event.data.status === "success") {
            toast.success(event.data.message || "Integration successful!");
          } else {
            toast.error(
              event.data.message || "Integration failed. Please try again."
            );
          }
          window.removeEventListener("message", handleMessage);
          popup?.close();
        }
      };

      window.addEventListener("message", handleMessage);
    },
  });
}
