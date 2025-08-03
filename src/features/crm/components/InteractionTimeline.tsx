import { useManageInteractions } from "../api/useManageInteractions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const interactionIcons: Record<string, React.ElementType> = {
  EMAIL: Mail,
  CALL: Phone,
  MEETING: Users,
};

export function InteractionTimeline({
  personId,
  organizationId,
  dealId,
}: {
  personId?: string;
  organizationId?: string;
  dealId?: string;
}) {
  const queryParams = { personId, organizationId, dealId };
  const { useGetAll } = useManageInteractions();
  const { data, isLoading } = useGetAll(queryParams);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <Skeleton className="h-20 w-full" />}
        {data?.data?.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No interactions logged yet.
          </p>
        )}
        {data?.data.map((item: any) => {
          const Icon = interactionIcons[item.type] || Mail;
          return (
            <div key={item.id} className="flex items-start gap-4">
              <Icon className="text-muted-foreground mt-1 h-5 w-5" />
              <div>
                <p className="text-sm font-medium">
                  {item.type} with {item.actor?.name || "Unknown"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(item.date).toLocaleString()}
                </p>
                <p className="mt-1 text-sm">{item.notes}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}