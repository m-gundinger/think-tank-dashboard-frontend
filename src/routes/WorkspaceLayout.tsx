import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiResource } from "@/hooks/useApiResource";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceLayout() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const location = useLocation();
  const { data: workspace, isLoading } = useApiResource("workspaces", [
    "workspaces",
  ]).useGetOne(workspaceId!);

  const currentTab = location.pathname.split("/")[3] || "projects";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {workspace?.name}
            </h1>
            <p className="text-muted-foreground">{workspace?.description}</p>
          </div>
        )}
      </div>

      <Tabs value={currentTab} className="space-y-4">
        <TabsList>
          <NavLink to={`/workspaces/${workspaceId}/projects`}>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </NavLink>
          <NavLink to={`/workspaces/${workspaceId}/teams`}>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </NavLink>
          <NavLink to={`/workspaces/${workspaceId}/analytics/dashboards`}>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </NavLink>
          <NavLink to={`/workspaces/${workspaceId}/attachments`}>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </NavLink>
        </TabsList>
        <Outlet />
      </Tabs>
    </div>
  );
}