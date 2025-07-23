import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
const settingsNavItems = [
  { to: "general", label: "General" },
  { to: "access", label: "Access Control" },
  { to: "custom-fields", label: "Custom Fields" },
  { to: "task-types", label: "Task Types" },
  { to: "views", label: "Views" },
  { to: "goals", label: "Goals" },
];
export function ProjectSettingsPage() {
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop() || "general";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Settings</h1>
        <p className="text-muted-foreground">
          Manage general settings, access control, and more for your project.
        </p>
      </div>

      <Tabs defaultValue={currentTab} className="space-y-4">
        <TabsList>
          {settingsNavItems.map((item) => (
            <NavLink to={item.to} key={item.to} end>
              <TabsTrigger value={item.to}>{item.label}</TabsTrigger>
            </NavLink>
          ))}
        </TabsList>
        <Outlet />
      </Tabs>
    </div>
  );
}
