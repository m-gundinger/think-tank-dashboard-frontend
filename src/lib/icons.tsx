import {
  Briefcase,
  CheckSquare,
  FileText,
  User,
  type LucideIcon,
  Book,
  FlaskConical,
  BarChart,
  Target,
  Bug,
  Lightbulb,
  Flame,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Project: Briefcase,
  Task: CheckSquare,
  Publication: FileText,
  User: User,
  Book,
  FlaskConical,
  BarChart,
  Target,
  Bug,
  Spike: Flame,
  Story: Book,
  Idea: Lightbulb,
  ProjectTemplate: FileText,
  Default: FileText,
};

export function getIcon(typeName: string | null | undefined): LucideIcon {
  if (!typeName) {
    return ICONS.Default;
  }

  const foundIcon = Object.keys(ICONS).find(
    (key) => key.toLowerCase() === typeName.toLowerCase()
  );
  return foundIcon ? ICONS[foundIcon] : ICONS.Default;
}