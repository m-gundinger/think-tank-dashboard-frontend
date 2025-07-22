// FILE: src/features/views/components/ViewList.tsx
import { useState } from "react";
import { useManageViews } from "../api/useManageViews";
import { ViewCard } from "./ViewCard";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { ViewForm } from "./ViewForm";

interface ViewListProps {
  workspaceId: string;
  projectId: string;
}

export function ViewList({ workspaceId, projectId }: ViewListProps) {
  const { useGetAll } = useManageViews(workspaceId, projectId);
  const { data: viewsData, isLoading } = useGetAll();
  const [editingViewId, setEditingViewId] = useState<string | null>(null);

  if (isLoading) return <div>Loading views...</div>;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {viewsData?.data?.map((view: any) => (
          <ViewCard
            key={view.id}
            view={view}
            workspaceId={workspaceId}
            projectId={projectId}
            onEdit={() => setEditingViewId(view.id)}
          />
        ))}
      </div>
      <ResourceCrudDialog
        isOpen={!!editingViewId}
        onOpenChange={(isOpen) => !isOpen && setEditingViewId(null)}
        resourceId={editingViewId}
        resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/views`}
        resourceKey={["views", projectId]}
        title="Edit View"
        description="Update the view's name and configuration."
        form={ViewForm}
        formProps={{ workspaceId, projectId }}
      />
    </>
  );
}
