import { CustomFieldDefinitionList } from "@/features/project-management/components/CustomFieldDefinitionList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { CustomFieldDefinitionForm } from "@/features/project-management/components/CustomFieldDefinitionForm";
import { ListPageLayout } from "@/components/shared/ListPageLayout";

export function ProjectCustomFieldsPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId || !projectId) return <div>Missing URL parameters.</div>;
  return (
    <ListPageLayout
      title="Custom Fields"
      description="Add and manage custom data fields for tasks in this project."
      actionButton={
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
      }
    >
      <CustomFieldDefinitionList
        workspaceId={workspaceId}
        projectId={projectId}
      />
    </ListPageLayout>
  );
}