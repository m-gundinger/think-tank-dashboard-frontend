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
  Kanban,
  List,
  Calendar,
  AreaChart,
  GitBranch,
  LayoutDashboard,
  Building2,
  Contact,
  Handshake,
  BookOpen,
  ClipboardList,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Project: Briefcase,
  Task: CheckSquare,
  Publication: FileText,
  User: User,
  Person: Contact,
  Organization: Building2,
  Deal: Handshake,
  KnowledgeBase: BookOpen,
  LeadForm: ClipboardList,
  Book,
  FlaskConical,
  BarChart,
  Target,
  Bug,
  Spike: Flame,
  Story: Book,
  Idea: Lightbulb,
  ProjectTemplate: FileText,
  KANBAN: Kanban,
  LIST: List,
  CALENDAR: Calendar,
  GANTT: AreaChart,
  BACKLOG: GitBranch,
  DASHBOARD: LayoutDashboard,
  WHITEBOARD: LayoutDashboard,
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