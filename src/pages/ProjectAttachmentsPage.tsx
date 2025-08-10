import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProjectAttachments } from "@/features/project-management/components/ProjectAttachments";
import { useManageProjects } from "@/features/project-management/api/useManageProjects";
export function ProjectAttachmentsPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  if (!workspaceId || !projectId) {
    return <div>Missing URL parameters.</div>;
  }

  const { useGetOne } = useManageProjects(workspaceId);
  const { data: projectData, isLoading } = useGetOne(projectId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
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
        <CardTitle>Project Attachments</CardTitle>
        <CardDescription>
          Link Knowledge Bases, Publications, and Whiteboards to this project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectAttachments project={projectData} workspaceId={workspaceId} />
      </CardContent>
    </Card>
  );
}
