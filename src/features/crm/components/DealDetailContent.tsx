import { Deal } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAbsoluteUrl } from "@/lib/utils";
import { Building2, User } from "lucide-react";
import { InteractionTimeline } from "./InteractionTimeline";

function InfoItem({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}) {
  if (!value && !children) return null;
  return (
    <div className="flex items-start gap-4 p-2">
      <Icon className="text-muted-foreground mt-1 h-5 w-5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">{value}</p>
        <p className="text-muted-foreground text-xs">{label}</p>
        {children}
      </div>
    </div>
  );
}

export function DealDetailContent({ deal }: { deal: Deal }) {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{deal.name}</h2>
        <p className="text-4xl font-bold text-green-600">
          {currencyFormatter.format(deal.value)}
        </p>
        <Badge variant="secondary">{deal.stage.name}</Badge>
      </div>

      <hr />

      <div className="space-y-1">
        <InfoItem
          icon={Building2}
          label="Organization"
          value={deal.organization.name}
        />
        <InfoItem icon={User} label="Owner">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={getAbsoluteUrl(null)} alt={deal.ownerName} />
              <AvatarFallback>{deal.ownerName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{deal.ownerName}</span>
          </div>
        </InfoItem>
      </div>
      <hr />
      <div className="px-2">
        <InteractionTimeline dealId={deal.id} />
      </div>
    </div>
  );
}