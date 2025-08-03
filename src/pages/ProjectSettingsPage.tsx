import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const settingsNavItems = [
  { to: "general", label: "General" },
  { to: "access", label: "Access Control" },
  { to: "custom-fields", label: "Custom Fields" },
  { to: "task-types", label: "Task Types" },
  { to: "views", label: "Views" },
  { to: "goals", label: "Goals" },
  { to: "templates", label: "Templates" },
  { to: "lead-forms", label: "Lead Forms" },
  { to: "attachments", label: "Attachments" },
];

export function ProjectSettingsPage() {
  const location = useLocation();
  const { workspaceId, projectId } = useParams();
  const currentTab = location.pathname.split("/").pop() || "general";

  const basePath = `/workspaces/${workspaceId}/projects/${projectId}/settings`;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
        <p className="text-muted-foreground">
          Manage general settings, access control, and more for your project.
        </p>
      </div>

      <Tabs value={currentTab} className="space-y-4">
        <TabsList>
          {settingsNavItems.map((item) => (
            <NavLink to={`${basePath}/${item.to}`} key={item.to} end>
              {({ isActive }) => (
                <TabsTrigger value={item.to} disabled={isActive}>
                  {item.label}
                </TabsTrigger>
              )}
            </NavLink>
          ))}
        </TabsList>
        <Outlet />
      </Tabs>
    </div>
  );
}