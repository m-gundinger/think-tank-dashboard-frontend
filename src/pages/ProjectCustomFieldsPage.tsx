import { CreateCustomFieldDialog } from "@/features/custom-fields/components/CreateCustomFieldDialog";
import { CustomFieldDefinitionList } from "@/features/custom-fields/components/CustomFieldDefinitionList";
import { useParams } from "react-router-dom";

export function ProjectCustomFieldsPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

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
        <CreateCustomFieldDialog
          workspaceId={workspaceId}
          projectId={projectId}
        />
      </div>
      <CustomFieldDefinitionList
        workspaceId={workspaceId}
        projectId={projectId}
      />
    </div>
  );
}
