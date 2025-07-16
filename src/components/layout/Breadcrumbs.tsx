import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { useGetProject } from "@/features/projects/api/useGetProject";
import { Skeleton } from "../ui/skeleton";

const STATIC_LABELS: Record<string, string> = {
  workspaces: "Workspaces",
  projects: "Projects",
  teams: "Teams",
  publications: "Publications",
  settings: "Settings",
  profile: "Profile",
  admin: "Admin",
  users: "Users",
  roles: "Roles",
  permissions: "Permissions",
  announcements: "Announcements",
  workflows: "Workflows",
  access: "Access Control",
  "custom-fields": "Custom Fields",
  security: "Security",
  integrations: "Integrations",
};

const BreadcrumbSkeleton = () => <Skeleton className="h-5 w-32 rounded-md" />;

export function Breadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const { workspaceId, projectId } = params;

  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace(
    workspaceId!
  );
  const { data: project, isLoading: isLoadingProject } = useGetProject(
    workspaceId!,
    projectId!
  );

  const pathnames = location.pathname.split("/").filter(Boolean);
  const crumbs: { label: React.ReactNode; href: string }[] = [];

  for (let i = 0; i < pathnames.length; i++) {
    const segment = pathnames[i];
    const href = `/${pathnames.slice(0, i + 1).join("/")}`;

    if (segment === "workspaces") {
      if (workspaceId && workspace) {
        crumbs.push({
          label: `Workspaces (${workspace.name})`,
          href: `/workspaces/${workspaceId}/projects`,
        });
        i++;
      } else if (workspaceId && isLoadingWorkspace) {
        crumbs.push({ label: <BreadcrumbSkeleton />, href: "#" });
        i++;
      } else {
        crumbs.push({ label: "Workspaces", href: "/workspaces" });
      }
    } else if (segment === "projects") {
      if (projectId && project) {
        crumbs.push({
          label: `Projects (${project.name})`,
          href: `/workspaces/${workspaceId}/projects/${projectId}`,
        });
        i++;
      } else if (projectId && isLoadingProject) {
        crumbs.push({ label: <BreadcrumbSkeleton />, href: "#" });
        i++;
      } else {
        crumbs.push({
          label: "Projects",
          href: `/workspaces/${workspaceId}/projects`,
        });
      }
    } else if (STATIC_LABELS[segment]) {
      crumbs.push({ label: STATIC_LABELS[segment], href });
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLastCrumb = index === crumbs.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLastCrumb ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastCrumb && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
