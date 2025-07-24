import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IntegrationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
  onManage?: () => void;
}

export function IntegrationCard({
  icon,
  title,
  description,
  isConnected,
  onConnect,
  onDisconnect,
  onManage,
}: IntegrationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg border">
          {icon}
        </div>
        <div className="flex-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* Future content can go here, like sync status */}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Badge
          variant={isConnected ? "default" : "outline"}
          className={isConnected ? "bg-green-500" : ""}
        >
          {isConnected ? "Connected" : "Not Connected"}
        </Badge>
        {isConnected ? (
          <div className="flex gap-2">
            {onDisconnect && (
              <Button variant="destructive" size="sm" onClick={onDisconnect}>
                Disconnect
              </Button>
            )}
            {onManage && (
              <Button variant="secondary" size="sm" onClick={onManage}>
                Manage
              </Button>
            )}
          </div>
        ) : (
          <Button size="sm" onClick={onConnect}>
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
