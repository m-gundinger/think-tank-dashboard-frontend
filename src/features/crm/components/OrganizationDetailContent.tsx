import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Globe } from "lucide-react";
import { RichTextOutput } from "@/components/ui/RichTextOutput";
import { Organization } from "@/types";
import { ManageOrganizationPeople } from "./ManageOrganizationPeople";
import { InteractionTimeline } from "./InteractionTimeline";

function InfoItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  href?: string;
}) {
  if (!value) return null;
  const content = (
    <div className="flex items-start gap-4">
      <Icon className="text-muted-foreground mt-1 h-5 w-5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">{value}</p>
        <p className="text-muted-foreground text-xs">{label}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:bg-accent block rounded-md p-2 transition-colors"
      >
        {content}
      </a>
    );
  }

  return <div className="p-2">{content}</div>;
}

export function OrganizationDetailContent({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <Avatar className="h-24 w-24 border">
          <AvatarFallback className="text-4xl">
            {organization.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{organization.name}</h2>
          <p className="text-muted-foreground text-sm">{organization.domain}</p>
        </div>
      </div>

      <hr />

      {organization.description && (
        <>
          <div className="space-y-2 px-2">
            <h3 className="text-muted-foreground text-sm font-semibold">
              About
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <RichTextOutput html={organization.description} />
            </div>
          </div>
          <hr />
        </>
      )}

      <div className="space-y-4">
        <h3 className="text-muted-foreground px-2 text-sm font-semibold">
          Details
        </h3>
        <div className="space-y-1">
          <InfoItem
            icon={Globe}
            label="Website"
            value={organization.domain}
            href={
              organization.domain ? `https://${organization.domain}` : undefined
            }
          />
        </div>
      </div>
      <hr />

      <div className="px-2">
        <ManageOrganizationPeople organization={organization} />
      </div>
      <hr />
      <div className="px-2">
        <InteractionTimeline organizationId={organization.id} />
      </div>
    </div>
  );
}