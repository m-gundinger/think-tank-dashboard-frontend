import {
  Briefcase,
  CheckSquare,
  FileText,
  User,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Project: Briefcase,
  Task: CheckSquare,
  Publication: FileText,
  User: User,
  Default: FileText,
};

export function getIcon(typeName: string) {
  return ICONS[typeName] || ICONS.Default;
}
