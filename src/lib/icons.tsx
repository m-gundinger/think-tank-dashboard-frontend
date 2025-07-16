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
  Default: FileText,
};

export function getIcon(typeName: string | null | undefined): LucideIcon {
  if (!typeName) {
    return ICONS.Default;
  }
  return ICONS[typeName] || ICONS.Default;
}