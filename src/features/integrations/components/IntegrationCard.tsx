// FILE: src/features/integrations/components/IntegrationCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IntegrationCardProps {
  integration: {
    name: string;
    description: string;
    logo: string;
    isConnected: boolean;
  };
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
}

export function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  isConnecting,
}: IntegrationCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start gap-4">
        <img
          src={integration.logo}
          alt={integration.name}
          className="h-12 w-12"
        />
        <div>
          <CardTitle>{integration.name}</CardTitle>
          <CardDescription>{integration.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        {integration.isConnected ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={onDisconnect}
            disabled={isConnecting}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={onConnect}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
