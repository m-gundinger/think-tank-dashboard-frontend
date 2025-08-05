import { useManageKnowledgeBases } from "@/features/collaboration/api/useManageKnowledgeBases";
import { KnowledgeBaseCard } from "@/features/collaboration/components/KnowledgeBaseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { KnowledgeBaseForm } from "@/features/collaboration/components/KnowledgeBaseForm";
import { Button } from "@/components/ui/button";
import { KnowledgeBase } from "@/types";

const ListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export function GlobalKnowledgeBasePage() {
  const { data, isLoading, isError, error } =
    useManageKnowledgeBases().useGetAll();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const editingKb = data?.data.find((kb: any) => kb.id === editingId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Bases</h1>
          <p className="text-muted-foreground">
            All knowledge bases you have access to across all workspaces.
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
          title="Create New Knowledge Base"
          description="Create a new knowledge base. You can associate it with a workspace later."
          form={KnowledgeBaseForm}
          resourcePath="knowledge-bases"
          resourceKey={["knowledgeBases"]}
        />
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState
          title="Failed to Load Knowledge Bases"
          message={
            (error as any)?.response?.data?.message ||
            "There was a problem fetching your knowledge bases."
          }
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="text-primary h-10 w-10" />}
          title="No Knowledge Bases Found"
          description="You are not a member of any workspaces with knowledge bases."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((kb: KnowledgeBase) => (
            <KnowledgeBaseCard
              key={kb.id}
              knowledgeBase={kb}
              onEdit={() => setEditingId(kb.id)}
            />
          ))}
        </div>
      )}

      {editingKb && (
        <ResourceCrudDialog
          isOpen={!!editingId}
          onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
          title="Edit Knowledge Base"
          description="Make changes to your knowledge base here."
          form={KnowledgeBaseForm}
          formProps={{ workspaceId: editingKb.workspaceId }}
          resourcePath={`knowledge-bases`}
          resourceKey={["knowledgeBases"]}
          resourceId={editingId}
        />
      )}
    </div>
  );
}
