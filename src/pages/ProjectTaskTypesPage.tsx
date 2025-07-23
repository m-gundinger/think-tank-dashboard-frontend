import { TaskTypeList } from "@/features/task-types/components/TaskTypeList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { TaskTypeForm } from "@/features/task-types/components/TaskTypeForm";

export function ProjectTaskTypesPage() {
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
          <h2 className="text-2xl font-semibold">Task Types</h2>
          <p className="text-muted-foreground">
            Define custom types for tasks in this project, like 'Bug' or
            'Story'.
          </p>
        </div>
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
          resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/task-types`}
          resourceKey={["taskTypes", projectId]}
        />
      </div>
      <TaskTypeList workspaceId={workspaceId} projectId={projectId} />
    </div>
  );
}
