import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  FileText,
  ChevronDown,
  Users,
  Shield,
  Lock,
  Zap,
  Megaphone,
  Clock,
  Activity,
  Contact,
  CheckSquare,
  Home,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mainNavItems = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/my-tasks", icon: CheckSquare, label: "My Tasks" },
  { to: "/workspaces", icon: FolderKanban, label: "Workspaces" },
  { to: "/publications", icon: FileText, label: "Publications" },
  { to: "/crm", icon: Contact, label: "CRM" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
];
const adminNavItems = [
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/roles", icon: Shield, label: "Roles" },
  { to: "/admin/permissions", icon: Lock, label: "Permissions" },
  { to: "/admin/workflows", icon: Zap, label: "Workflows" },
  { to: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { to: "/admin/jobs", icon: Clock, label: "Jobs & Queues" },
  { to: "/admin/system", icon: Activity, label: "System Status" },
];

export function Sidebar() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const [isAdminOpen, setIsAdminOpen] = useState(isAdminPath);

  return (
    <aside className="hidden w-64 flex-col border-r bg-gray-100/40 p-4 lg:flex">
      <h1 className="mb-8 text-2xl font-bold">AutoNomos</h1>
      <nav className="flex flex-col gap-1">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}

        <div>
          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={cn(
              "text-muted-foreground hover:text-primary flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all",
              isAdminPath && "bg-muted text-primary"
            )}
          >
            <div className="flex items-center gap-3">
              <Wrench className="h-4 w-4" />
              <span>Admin</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isAdminOpen && "rotate-180"
              )}
            />
          </button>
          {isAdminOpen && (
            <div className="mt-1 space-y-1 pl-6">
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-normal transition-all",
                      isActive && "text-primary"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}