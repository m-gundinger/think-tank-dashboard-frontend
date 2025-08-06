import { useParams } from "react-router-dom";
import { useApiResource } from "@/hooks/useApiResource";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { WorkspaceAttachments } from "@/features/workspaces/components/WorkspaceAttachments";
export function WorkspaceAttachmentsPage() {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  if (!workspaceId) {
    return <div>Missing URL parameters.</div>;
  }

  const workspaceResource = useApiResource(`workspaces`, ["workspaces"]);
  const { data: workspaceData, isLoading } =
    workspaceResource.useGetOne(workspaceId);

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

  if (!workspaceData) {
    return <div>Workspace not found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Attachments</CardTitle>
        <CardDescription>
          Link Knowledge Bases, Publications, and Whiteboards to this workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WorkspaceAttachments workspace={workspaceData} />
      </CardContent>
    </Card>
  );
}