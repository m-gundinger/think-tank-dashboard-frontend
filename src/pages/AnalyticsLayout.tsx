import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const analyticsNavItems = [
  { to: "/analytics/activities", label: "Activities" },
  { to: "/analytics/dashboards", label: "Dashboards" },
  { to: "/analytics/reporting", label: "Reporting" },
  { to: "/analytics/reports", label: "Reports" },
];

export function AnalyticsLayout() {
  const location = useLocation();
  const currentTab = location.pathname.split("/")[2] || "activities";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Explore global insights and trends across all your work.
        </p>
      </div>

      <Tabs value={currentTab} className="space-y-4">
        <TabsList>
          {analyticsNavItems.map((item) => (
            <NavLink to={item.to} key={item.to} end>
              {({ isActive }) => (
                <TabsTrigger value={item.to.split("/")[2]} disabled={isActive}>
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
