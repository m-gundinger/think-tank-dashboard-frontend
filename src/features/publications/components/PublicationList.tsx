import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { PublicationCard } from "./PublicationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreatePublicationForm } from "./CreatePublicationForm";
import { AnyValue } from "@/types";

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
  const publicationResource = useApiResource("publications", ["publications"]);
  const { data, isLoading, isError } = publicationResource.useGetAll();
  const [editingPublication, setEditingPublication] = useState<AnyValue | null>(
    null
  );

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
            onEdit={setEditingPublication}
          />
        ))}
      </div>
      <ResourceCrudDialog
        isOpen={!!editingPublication}
        onOpenChange={(isOpen) => !isOpen && setEditingPublication(null)}
        trigger={<></>}
        title="Edit Publication"
        description="Make changes to the publication details."
        form={CreatePublicationForm}
        resourcePath="publications"
        resourceKey={["publications"]}
        resourceId={editingPublication?.id}
      />
    </>
  );
}