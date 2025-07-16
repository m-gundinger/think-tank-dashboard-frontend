import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function connectGoogle(): Promise<string> {
  return new Promise((resolve, reject) => {
    const connectUrl =
      "http://localhost:3000/api/v1/integrations/google/connect";
    const windowName = "google-oauth-window";
    const windowFeatures = "width=600,height=700,top=100,left=100";

    const popup = window.open(connectUrl, windowName, windowFeatures);
    if (!popup) {
      toast.error("Popup blocked!", {
        description:
          "Please allow popups for this site to connect your account.",
      });
      return reject(new Error("Popup was blocked by the browser."));
    }

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.source === "google-oauth-callback") {
        if (event.data.status === "success") {
          resolve("Successfully connected Google account.");
        } else {
          reject(new Error(event.data.message || "An unknown error occurred."));
        }

        window.removeEventListener("message", messageListener);
        if (!popup.closed) {
          popup.close();
        }
      }
    };

    window.addEventListener("message", messageListener);

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener("message", messageListener);

        resolve("Popup closed.");
      }
    }, 1000);
  });
}

export function useConnectGoogle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: connectGoogle,
    onSuccess: (message) => {
      if (message.includes("Successfully")) {
        toast.success(message);
      }
      queryClient.invalidateQueries({ queryKey: ["social-credentials"] });
    },
    onError: (error: Error) => {
      toast.error("Connection Failed", {
        description: error.message,
      });
    },
  });
}
