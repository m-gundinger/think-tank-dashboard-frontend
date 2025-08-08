import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
const settingsNavItems = [
  { to: "/settings/integrations", label: "Integrations" },
  { to: "/settings/security", label: "Security" },
  { to: "/settings/task-types", label: "Task Types" },
];

export function SettingsPage() {
  const location = useLocation();
  const currentTab =
    settingsNavItems.find((item) => location.pathname.startsWith(item.to))
      ?.to || "/settings/integrations";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and integrations.
        </p>
      </div>

      <Tabs value={currentTab} className="space-y-4">
        <TabsList>
          {settingsNavItems.map((item) => (
            <NavLink to={item.to} key={item.to}>
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