import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Clipboard } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { WhiteboardForm } from "./WhiteboardForm";
import { WhiteboardCard } from "./WhiteboardCard";
import { useManageWhiteboards } from "../api/useManageWhiteboards";

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

export function WhiteboardList() {
  const { useGetAll } = useManageWhiteboards();
  const { data, isLoading, isError, error } = useGetAll();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) return <ListSkeleton />;
  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Whiteboards"
        message={
          (error as any)?.response?.data?.message ||
          "There was a problem fetching your whiteboards."
        }
      />
    );
  }

  const whiteboards = data?.data || [];

  if (whiteboards.length === 0) {
    return (
      <EmptyState
        icon={<Clipboard className="h-10 w-10 text-primary" />}
        title="No Whiteboards Found"
        description="Get started by creating your first whiteboard."
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {whiteboards.map((wb: any) => (
          <WhiteboardCard
            key={wb.id}
            whiteboard={wb}
            onEdit={() => setEditingId(wb.id)}
          />
        ))}
      </div>
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
    </>
  );
}