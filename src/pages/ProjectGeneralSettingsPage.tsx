import { useParams } from "react-router-dom";
import { useGetProject } from "@/features/projects/api/useGetProject";
import { EditProjectForm } from "@/features/projects/components/EditProjectForm";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ProjectGeneralSettingsPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  if (!workspaceId || !projectId) {
    return <div>Missing URL parameters.</div>;
  }

  const { data: projectData, isLoading } = useGetProject(
    workspaceId,
    projectId
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!projectData) {
    return <div>Project not found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Update the name and description of your project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EditProjectForm project={projectData} />
      </CardContent>
    </Card>
  );
}
