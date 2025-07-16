import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface IntegrationCardProps {
  icon: ReactNode;
  name: string;
  description: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  isPending: boolean;
}

export function IntegrationCard({
  icon,
  name,
  description,
  isConnected,
  onConnect,
  onDisconnect,
  isPending,
}: IntegrationCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-gray-50">
          {icon}
        </div>
        <div className="flex-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between">
        {isConnected ? (
          <Badge variant="secondary">Connected</Badge>
        ) : (
          <Badge variant="outline">Not Connected</Badge>
        )}
        <Button
          variant={isConnected ? "destructive" : "default"}
          onClick={isConnected ? onDisconnect : onConnect}
          disabled={isPending}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  );
}
