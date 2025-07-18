// FILE: src/features/crm/components/PersonDetailContent.tsx
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
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-muted-foreground mt-1 h-4 w-4" />
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

export function PersonDetailContent({ person }: { person: any }) {
  const name = `${person.firstName} ${person.lastName}`;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={getAbsoluteUrl(person.avatarUrl)}
            alt={name}
            className="h-full w-full object-cover"
          />
          <AvatarFallback className="text-3xl">
            {name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <div className="mt-1 flex flex-wrap gap-1">
            {person.roles?.map((role: string) => (
              <Badge key={role} variant="outline">
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoItem icon={Mail} label="Email" value={person.email} />
        <InfoItem icon={Phone} label="Phone" value={person.phoneNumber} />
        <InfoItem
          icon={Cake}
          label="Birthday"
          value={person.birthday && format(new Date(person.birthday), "PPP")}
        />
      </div>

      {person.biography && (
        <div>
          <h3 className="mb-2 font-semibold">Biography</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <RichTextOutput html={person.biography} />
          </div>
        </div>
      )}

      {person.socialLinks?.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold">On the Web</h3>
          <div className="space-y-2">
            {person.socialLinks.map((link: any) => {
              const Icon = socialIcons[link.provider] || ExternalLink;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary flex items-center gap-2 text-sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{link.url}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {person.skills?.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {person.skills.map((skill: any) => (
              <Badge key={skill.id} variant="secondary">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
