import { useCallback } from "react";
import { toast } from "sonner";

export function useOAuth() {
  const openOAuthPopup = useCallback(
    (provider: string, workspaceId: string) => {
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const url = `http://localhost:3000/api/v1/integrations/connect/${provider}?workspaceId=${workspaceId}`;

      const popup = window.open(
        url,
        "oauth-popup",
        `width=${width},height=${height},top=${top},left=${left}`
      );

      return new Promise<void>((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          if (
            event.origin !== window.location.origin ||
            event.data?.source !== "google-oauth-callback"
          ) {
            return;
          }

          if (event.data.status === "success") {
            toast.success("Integration connected successfully.");
            resolve();
          } else {
            toast.error("Failed to connect integration.", {
              description: event.data.message || "An unknown error occurred.",
            });
            reject(new Error(event.data.message));
          }
          window.removeEventListener("message", handleMessage);
        };

        window.addEventListener("message", handleMessage);

        const checkPopupClosed = setInterval(() => {
          if (popup && popup.closed) {
            clearInterval(checkPopupClosed);
            window.removeEventListener("message", handleMessage);
            // Resolve without success toast if popup is closed manually
            resolve();
          }
        }, 1000);
      });
    },
    []
  );

  return { openOAuthPopup };
}
