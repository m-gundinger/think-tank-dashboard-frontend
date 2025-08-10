import { useManageKnowledgeBases } from "../api/useManageKnowledgeBases";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
import { KnowledgeBaseForm } from "./KnowledgeBaseForm";

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
export function KnowledgeBaseList({ workspaceId }: { workspaceId: string }) {
  const kbResource = useManageKnowledgeBases();
  const { data, isLoading, isError, error } = kbResource.useGetAll({
    workspaceId,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return <ListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Knowledge Bases"
        message={
          (error as any)?.response?.data?.message ||
          "There was a problem fetching your knowledge bases."
        }
      />
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="h-10 w-10 text-primary" />}
        title="No Knowledge Bases Found"
        description="Get started by creating your first knowledge base using the button above."
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((kb: any) => (
          <KnowledgeBaseCard
            key={kb.id}
            knowledgeBase={{ ...kb, workspaceId }}
            onEdit={() => setEditingId(kb.id)}
          />
        ))}
      </div>

      <ResourceCrudDialog
        isOpen={!!editingId}
        onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
        title="Edit Knowledge Base"
        description="Make changes to your knowledge base here."
        form={KnowledgeBaseForm}
        formProps={{ workspaceId }}
        resourcePath={`knowledge-bases`}
        resourceKey={["knowledgeBases", workspaceId]}
        resourceId={editingId}
      />
    </>
  );
}