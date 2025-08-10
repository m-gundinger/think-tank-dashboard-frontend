import { ProjectTemplateList } from "@/features/project-management/components/ProjectTemplateList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { CreateTemplateForm } from "@/features/project-management/components/CreateTemplateForm";
import { ListPageLayout } from "@/components/shared/ListPageLayout";

export function ProjectTemplatesPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId || !projectId) return <div>Missing URL parameters.</div>;
  return (
    <ListPageLayout
      title="Project Templates"
      description="Save this project's structure as a template for future use."
      actionButton={
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Save as Template
            </Button>
          }
          title="Save Project as Template"
          description="This will create a new template based on the current project's structure (views, custom fields, etc.). Tasks and other content will not be included."
          form={CreateTemplateForm}
          formProps={{ workspaceId, projectId, sourceProjectId: projectId }}
          resourcePath={`project-templates`}
          resourceKey={["projectTemplates"]}
        />
      }
    >
      <ProjectTemplateList workspaceId={workspaceId} projectId={projectId} />
    </ListPageLayout>
  );
}