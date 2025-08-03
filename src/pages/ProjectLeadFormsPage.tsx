import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { LeadForm } from "@/features/lead-form/components/LeadForm";
import { LeadFormList } from "@/features/lead-form/components/LeadFormList";

export function ProjectLeadFormsPage() {
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
          <h2 className="text-2xl font-semibold">Lead Forms</h2>
          <p className="text-muted-foreground">
            Create and manage lead capture forms for this project.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Form
            </Button>
          }
          title="Create New Lead Form"
          description="Build a form to capture leads directly into your project."
          form={LeadForm}
          formProps={{ workspaceId, projectId }}
          resourcePath={`workspaces/${workspaceId}/projects/${projectId}/lead-forms`}
          resourceKey={["leadForms", projectId]}
        />
      </div>
      <LeadFormList workspaceId={workspaceId} projectId={projectId} />
    </div>
  );
}
