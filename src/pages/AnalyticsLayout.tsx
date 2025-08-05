import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AnalyticsLayout() {
  const location = useLocation();
  const { workspaceId } = useParams<{ workspaceId?: string }>();

  const basePath = workspaceId
    ? `/workspaces/${workspaceId}/analytics`
    : "/analytics";

  const analyticsNavItems = [
    ...(workspaceId
      ? [{ to: `${basePath}/dashboards`, label: "Dashboards" }]
      : [
          { to: `${basePath}/activities`, label: "Activities" },
          { to: `${basePath}/dashboards`, label: "Dashboards" },
        ]),
    { to: `${basePath}/reporting`, label: "Reporting" },
    ...(workspaceId
      ? [{ to: `${basePath}/activity`, label: "Activity" }]
      : [{ to: `${basePath}/reports`, label: "Reports" }]),
  ];

  const currentTab = location.pathname.split("/").pop() || "activities";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          {workspaceId
            ? "Explore insights and trends for this workspace."
            : "Explore global insights and trends across all your work."}
        </p>
      </div>

      <Tabs value={currentTab} className="space-y-4">
        <TabsList>
          {analyticsNavItems.map((item) => (
            <NavLink to={item.to} key={item.to} end>
              {({ isActive }) => (
                <TabsTrigger
                  value={item.to.split("/").pop()!}
                  disabled={isActive}
                >
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
