import { useManageWhiteboards } from "@/features/collaboration/api/useManageWhiteboards";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Clipboard, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { WhiteboardForm } from "@/features/collaboration/components/WhiteboardForm";
import { WhiteboardCard } from "@/features/collaboration/components/WhiteboardCard";
import { Button } from "@/components/ui/button";

const ListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
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

export function WhiteboardsPage() {
  const { data, isLoading, isError, error } =
    useManageWhiteboards().useGetAll();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Whiteboards</h1>
          <p className="text-muted-foreground">
            All whiteboards you have access to across all your projects.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Whiteboard
            </Button>
          }
          title="Create a New Whiteboard"
          description="Whiteboards are collaborative canvases for your ideas."
          form={WhiteboardForm}
          resourcePath="whiteboards"
          resourceKey={["whiteboards"]}
        />
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState
          title="Failed to Load Whiteboards"
          message={
            (error as any)?.response?.data?.message ||
            "There was a problem fetching your whiteboards."
          }
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          icon={<Clipboard className="text-primary h-10 w-10" />}
          title="No Whiteboards Found"
          description="Get started by creating your first whiteboard."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((wb: any) => (
            <WhiteboardCard
              key={wb.id}
              whiteboard={wb}
              onEdit={() => setEditingId(wb.id)}
            />
          ))}
        </div>
      )}
      <ResourceCrudDialog
        isOpen={!!editingId}
        onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
        title="Edit Whiteboard"
        description="Update the name of your whiteboard."
        form={WhiteboardForm}
        resourcePath="whiteboards"
        resourceKey={["whiteboards"]}
        resourceId={editingId}
      />
    </div>
  );
}
