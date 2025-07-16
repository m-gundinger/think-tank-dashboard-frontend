import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function IntegrationCallbackPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");

    if (window.opener) {
      window.opener.postMessage(
        {
          source: "google-oauth-callback",
          status: status,
          message: message,
        },
        window.location.origin
      );

      window.close();
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Processing...</h1>
        <p className="text-muted-foreground">
          You can close this window if it does not close automatically.
        </p>
      </div>
    </div>
  );
}
