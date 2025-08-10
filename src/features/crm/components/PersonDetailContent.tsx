import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Cake,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  Phone,
  Twitter,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { RichTextOutput } from "@/components/shared/RichTextOutput";
import { getAbsoluteUrl, parseServerDate } from "@/lib/utils";
import { InteractionTimeline } from "./InteractionTimeline";
import { CrmAttachments } from "./CrmAttachments";
import { Person } from "@/types";

const socialIcons: Record<string, React.ElementType> = {
  LINKEDIN: Linkedin,
  TWITTER: Twitter,
  GITHUB: Github,
  WEBSITE: Globe,
  OTHER: ExternalLink,
};

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
      <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm font-medium">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-md p-2 transition-colors hover:bg-accent"
      >
        {content}
      </a>
    );
  }

  return <div className="p-2">{content}</div>;
}

export function PersonDetailContent({ person }: { person: Person }) {
  const name = `${person.firstName} ${person.lastName}`;
  const roles = person.roles?.join(", ") || "Contact";
  const birthday = parseServerDate(person.birthday);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <Avatar className="h-24 w-24 border">
          <AvatarImage
            src={getAbsoluteUrl(person.avatarUrl)}
            alt={name}
            className="h-full w-full object-cover"
          />
          <AvatarFallback className="text-4xl">
            {name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-sm text-muted-foreground">{roles}</p>
        </div>
      </div>

      <hr />

      <div className="space-y-4">
        <h3 className="px-2 text-sm font-semibold text-muted-foreground">
          Contact Information
        </h3>
        <div className="space-y-1">
          <InfoItem
            icon={Mail}
            label="Email"
            value={person.email}
            href={person.email ? `mailto:${person.email}` : undefined}
          />
          <InfoItem
            icon={Phone}
            label="Phone"
            value={person.phoneNumber}
            href={person.phoneNumber ? `tel:${person.phoneNumber}` : undefined}
          />
          <InfoItem
            icon={Cake}
            label="Birthday"
            value={birthday && format(birthday, "PPP")}
          />
        </div>
      </div>

      {person.organizations?.length > 0 && (
        <>
          <hr />
          <div className="space-y-4">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground">
              Organizations
            </h3>
            <div className="space-y-1">
              {person.organizations.map((link: any) => (
                <InfoItem
                  key={link.organizationId}
                  icon={Building2}
                  label={link.role || "Member"}
                  value={link.organization.name}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {person.biography && (
        <>
          <hr />
          <div className="space-y-2 px-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Biography
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <RichTextOutput html={person.biography} />
            </div>
          </div>
        </>
      )}

      {person.socialLinks?.length > 0 && (
        <>
          <hr />
          <div className="space-y-4">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground">
              On the Web
            </h3>
            <div className="space-y-1">
              {person.socialLinks.map((link: any) => {
                const Icon = socialIcons[link.provider] || ExternalLink;
                return (
                  <InfoItem
                    key={link.id}
                    icon={Icon}
                    label={link.provider}
                    value={<span className="truncate">{link.url}</span>}
                    href={link.url}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}

      {person.skills?.length > 0 && (
        <>
          <hr />
          <div className="space-y-2 px-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {person.skills.map((skill: any) => (
                <Badge key={skill.id} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
      <hr />
      <CrmAttachments entity={person} entityType="people" />
      <hr />
      <div className="px-2">
        <InteractionTimeline personId={person.id} />
      </div>
    </div>
  );
}