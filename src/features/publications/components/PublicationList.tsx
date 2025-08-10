import { useState } from "react";
import { PublicationCard } from "./PublicationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreatePublicationForm } from "./CreatePublicationForm";
import { useManagePublications } from "../api/useManagePublications";

const PublicationListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export function PublicationList() {
  const { useGetAll } = useManagePublications();
  const { data, isLoading, isError } = useGetAll();
  const [editingPublicationId, setEditingPublicationId] = useState<
    string | null
  >(null);

  if (isLoading) return <PublicationListSkeleton />;
  if (isError) return <div>Failed to load publications.</div>;
  if (!data || data.data.length === 0) return <div>No publications found.</div>;
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.data.map((pub: any) => (
          <PublicationCard
            key={pub.id}
            publication={pub}
            onEdit={() => setEditingPublicationId(pub.id)}
          />
        ))}
      </div>
      <ResourceCrudDialog
        isOpen={!!editingPublicationId}
        onOpenChange={(isOpen) => !isOpen && setEditingPublicationId(null)}
        title="Edit Publication"
        description="Make changes to the publication details."
        form={CreatePublicationForm}
        resourcePath="publications"
        resourceKey={["publications"]}
        resourceId={editingPublicationId}
      />
    </>
  );
}
