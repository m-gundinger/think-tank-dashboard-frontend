import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  isConnected: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onManage?: () => void;
  isConnecting?: boolean;
}

export function IntegrationCard({
  name,
  description,
  icon: Icon,
  isConnected,
  onConnect,
  onDisconnect,
  onManage,
  isConnecting,
}: IntegrationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            <span>{name}</span>
          </CardTitle>
          <CardDescription className="mt-2">{description}</CardDescription>
        </div>
        {isConnected ? (
          <Badge variant="default" className="bg-green-500">
            Connected
          </Badge>
        ) : (
          <Badge variant="outline">Not Connected</Badge>
        )}
      </CardHeader>
      <CardContent className="flex justify-end gap-2">
        {isConnected ? (
          <>
            {onManage && (
              <Button variant="outline" onClick={onManage}>
                Manage
              </Button>
            )}
            {onDisconnect && (
              <Button variant="destructive" onClick={onDisconnect}>
                Disconnect
              </Button>
            )}
          </>
        ) : (
          onConnect && (
            <Button onClick={onConnect} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
}
