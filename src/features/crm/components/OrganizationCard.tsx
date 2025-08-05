import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Organization } from "@/types";

interface OrganizationCardProps {
  organization: Organization;
  onSelect: () => void;
}

export function OrganizationCard({
  organization,
  onSelect,
}: OrganizationCardProps) {
  return (
    <Card
      className="hover:border-primary cursor-pointer transition-colors"
      onClick={onSelect}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{organization.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base">{organization.name}</CardTitle>
          <CardDescription className="text-xs">
            {organization.domain}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground truncate text-sm">
          {organization.description || "No description."}
        </p>
      </CardContent>
    </Card>
  );
}