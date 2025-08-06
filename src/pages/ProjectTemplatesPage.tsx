import { ProjectTemplateList } from "@/features/project-management/components/ProjectTemplateList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateTemplateForm } from "@/features/project-management/components/CreateTemplateForm";

export function ProjectTemplatesPage() {
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
          <h2 className="text-2xl font-semibold">Project Templates</h2>
          <p className="text-muted-foreground">
            Save this project's structure as a template for future use.
          </p>
        </div>
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
      </div>
      <ProjectTemplateList workspaceId={workspaceId} projectId={projectId} />
    </div>
  );
}