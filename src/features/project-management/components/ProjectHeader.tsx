import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAbsoluteUrl } from "@/lib/utils";
import { Project } from "@/types";
import { Filter, Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectHeaderProps {
  project: Project;
  onNewTaskClick: () => void;
  onNewTaskFromTemplateClick: () => void;
}

export function ProjectHeader({
  project,
  onNewTaskClick,
  onNewTaskFromTemplateClick,
}: ProjectHeaderProps) {
  const members = project.members || [];

  return (
    <div className="flex items-center justify-between">
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
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hover:bg-hover border-border bg-element text-foreground"
        >
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onNewTaskClick}>
              New Blank Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onNewTaskFromTemplateClick}>
              New from Template...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-hover border-border bg-element text-foreground"
          asChild
        >
          <Link to="settings">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}