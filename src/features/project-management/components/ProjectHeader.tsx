import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAbsoluteUrl } from "@/lib/utils";
import { Project } from "@/types";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const members = project.members || [];

  return (
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {project.name}
      </h1>
      <div className="flex -space-x-2">
        {members.slice(0, 3).map((member: any) => (
          <Avatar
            key={member.userId}
            className="h-8 w-8 border-2 border-background"
          >
            <AvatarImage src={getAbsoluteUrl(member.avatarUrl)} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
        {members.length > 3 && (
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback>+{members.length - 3}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
