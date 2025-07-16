import { useState } from "react";
import { useGetPublications } from "../api/useGetPublications";
import { PublicationCard } from "./PublicationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EditPublicationDialog } from "./EditPublicationDialog";

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
  const { data, isLoading, isError } = useGetPublications({
    page: 1,
    limit: 12,
  });
  const [editingPublication, setEditingPublication] = useState<any | null>(
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
      <EditPublicationDialog
        publication={editingPublication}
        isOpen={!!editingPublication}
        onOpenChange={(isOpen) => !isOpen && setEditingPublication(null)}
      />
    </>
  );
}
