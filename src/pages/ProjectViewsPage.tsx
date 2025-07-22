// FILE: src/pages/ProjectViewsPage.tsx
import { ViewList } from "@/features/views/components/ViewList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { ViewForm } from "@/features/views/components/ViewForm";

export function ProjectViewsPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId || !projectId) return <div>Missing URL parameters.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Views</h2>
          <p className="text-muted-foreground">
            Manage the different ways to visualize your project's tasks.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New View
            </Button>
          }
          title="Create New View"
          description="Add a new List, Kanban, or other type of view to your project."
          form={ViewForm}
          formProps={{ workspaceId, projectId }}
          resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/views`}
          resourceKey={["views", projectId]}
        />
      </div>
      <ViewList workspaceId={workspaceId} projectId={projectId} />
    </div>
  );
}
