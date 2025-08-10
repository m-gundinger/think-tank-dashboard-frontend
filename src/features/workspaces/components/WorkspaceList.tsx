import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Blocks } from "lucide-react";
import { useState } from "react";
import { WorkspaceCard } from "./WorkspaceCard";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { WorkspaceForm } from "./WorkspaceForm";
import { useManageWorkspaces } from "../api/useManageWorkspaces";

const WorkspaceListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </div>
);
export function WorkspaceList() {
  const { useGetAll } = useManageWorkspaces();
  const { data, isLoading, isError, error } = useGetAll();
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(
    null
  );

  if (isLoading) {
    return <WorkspaceListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Workspaces"
        message={
          (error as any)?.response?.data?.message ||
          "There was a problem fetching your workspaces. Please try again later."
        }
      />
    );
  }

  const handleEdit = (workspaceId: string) => {
    setEditingWorkspaceId(workspaceId);
  };

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<Blocks className="h-10 w-10 text-primary" />}
        title="No Workspaces Found"
        description="Get started by creating your first workspace using the button above."
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((workspace: any) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <ResourceCrudDialog
        isOpen={!!editingWorkspaceId}
        onOpenChange={(isOpen) => !isOpen && setEditingWorkspaceId(null)}
        trigger={<></>}
        title="Edit Workspace"
        description="Make changes to your workspace here. Click save when you're done."
        form={WorkspaceForm}
        resourcePath="workspaces"
        resourceKey={["workspaces"]}
        resourceId={editingWorkspaceId}
      />
    </>
  );
}
