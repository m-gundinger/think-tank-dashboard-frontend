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
import { RichTextOutput } from "@/components/ui/RichTextOutput";
import { getAbsoluteUrl } from "@/lib/utils";
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

export function PersonDetailContent({ person }: { person: any }) {
  const name = `${person.firstName} ${person.lastName}`;
  const roles = person.roles?.join(", ") || "Contact";

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
          <p className="text-muted-foreground text-sm">{roles}</p>
        </div>
      </div>

      <hr />

      <div className="space-y-4">
        <h3 className="text-muted-foreground px-2 text-sm font-semibold">
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
            value={person.birthday && format(new Date(person.birthday), "PPP")}
          />
        </div>
      </div>

      {person.companies?.length > 0 && (
        <>
          <hr />
          <div className="space-y-4">
            <h3 className="text-muted-foreground px-2 text-sm font-semibold">
              Companies
            </h3>
            <div className="space-y-1">
              {person.companies.map((link: any) => (
                <InfoItem
                  key={link.companyId}
                  icon={Building2}
                  label={link.role || "Member"}
                  value={link.company.name}
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
            <h3 className="text-muted-foreground text-sm font-semibold">
              Biography
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <RichTextOutput html={person.biography} />
            </div>
          </div>
        </>
      )}

      {person.socialLinks?.length > 0 && (
        <>
          <hr />
          <div className="space-y-4">
            <h3 className="text-muted-foreground px-2 text-sm font-semibold">
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
            <h3 className="text-muted-foreground text-sm font-semibold">
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
    </div>
  );
}