import { CustomFieldDefinitionList } from "@/features/project-management/components/CustomFieldDefinitionList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CustomFieldDefinitionForm } from "@/features/project-management/components/CustomFieldDefinitionForm";

export function ProjectCustomFieldsPage() {
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
          <h2 className="text-2xl font-semibold">Custom Fields</h2>
          <p className="text-muted-foreground">
            Add and manage custom data fields for tasks in this project.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Custom Field
            </Button>
          }
          title="Create New Custom Field"
          description="This field will be available for all tasks in this project."
          form={CustomFieldDefinitionForm}
          formProps={{ workspaceId, projectId }}
          resourcePath={`workspaces/${workspaceId}/projects/${projectId}/custom-fields`}
          resourceKey={["customFieldDefinitions", projectId]}
        />
      </div>
      <CustomFieldDefinitionList
        workspaceId={workspaceId}
        projectId={projectId}
      />
    </div>
  );
}
