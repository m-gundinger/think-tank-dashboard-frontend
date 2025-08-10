import { TaskTypeList } from "@/features/project-management/components/TaskTypeList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { TaskTypeForm } from "@/features/project-management/components/TaskTypeForm";
import { ListPageLayout } from "@/components/shared/ListPageLayout";

export function ProjectTaskTypesPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId || !projectId) return <div>Missing URL parameters.</div>;
  return (
    <ListPageLayout
      title="Task Types"
      description="Define custom types for tasks in this project, like 'Bug' or 'Story'."
      actionButton={
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Type
            </Button>
          }
          title="Create New Task Type"
          description="This type will be available for all tasks in this project."
          form={TaskTypeForm}
          formProps={{ workspaceId, projectId }}
          resourcePath={`workspaces/${workspaceId}/projects/${projectId}/task-types`}
          resourceKey={["taskTypes", projectId]}
        />
      }
    >
      <TaskTypeList workspaceId={workspaceId} projectId={projectId} />
    </ListPageLayout>
  );
}