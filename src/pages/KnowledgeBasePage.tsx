// FILE: src/pages/KnowledgeBasePage.tsx
import { KnowledgeBaseList } from "@/features/knowledge-base/components/KnowledgeBaseList";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { KnowledgeBaseForm } from "@/features/knowledge-base/components/KnowledgeBaseForm";

export function KnowledgeBasePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!workspaceId) {
    return <div>Invalid Workspace ID</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            All Knowledge Bases
          </h2>
          <p className="text-muted-foreground">
            A list of all knowledge bases within this workspace.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Knowledge Base
            </Button>
          }
          title="Create a new knowledge base"
          description="Knowledge bases contain documents and pages."
          form={KnowledgeBaseForm}
          formProps={{ workspaceId }}
          resourcePath={`/workspaces/${workspaceId}/knowledge-bases`}
          resourceKey={["knowledgeBases", workspaceId]}
        />
      </div>
      <KnowledgeBaseList workspaceId={workspaceId} />
    </div>
  );
}
