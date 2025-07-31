import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icons";
import { IntegrationProvider } from "@/types/api";

interface IntegrationCardProps {
  provider: IntegrationProvider;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function IntegrationCard({
  provider,
  isConnected,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  const Icon = getIcon(provider);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8" />
          <CardTitle className="text-base font-medium">{provider}</CardTitle>
        </div>
        {isConnected ? (
          <Button variant="destructive" onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={onConnect}>Connect</Button>
        )}
      </CardHeader>
    </Card>
  );
}
