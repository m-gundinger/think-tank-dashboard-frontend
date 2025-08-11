import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { CreatePublicationForm } from "@/features/publications/components/CreatePublicationForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PublicationCategoryManager } from "@/features/publications/components/PublicationCategoryManager";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { PublicationCard } from "@/features/publications/components/PublicationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useManagePublications } from "@/features/publications/api/useManagePublications";

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

export function PublicationsPage() {
  const [dialogState, setDialogState] = useState({
    open: false,
    type: "create",
  });
  const [editingPublicationId, setEditingPublicationId] = useState<
    string | null
  >(null);
  const { useGetAll } = useManagePublications();
  const { data, isLoading, isError } = useGetAll();

  return (
    <ListPageLayout
      title="Publications"
      description="Manage your organization's articles, papers, and other publications."
      actionButton={
        <div className="flex items-center gap-2">
          <Dialog
            open={dialogState.open && dialogState.type === "manageCategories"}
            onOpenChange={(isOpen) =>
              setDialogState({ ...dialogState, open: isOpen })
            }
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() =>
                  setDialogState({ open: true, type: "manageCategories" })
                }
              >
                <Settings className="mr-2 h-4 w-4" /> Manage Categories
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publication Categories</DialogTitle>
                <DialogDescription>
                  Create, edit, and delete categories for organizing
                  publications.
                </DialogDescription>
              </DialogHeader>
              <PublicationCategoryManager />
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => setDialogState({ open: true, type: "create" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Publication
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <PublicationListSkeleton />
      ) : isError ? (
        <div>Failed to load publications.</div>
      ) : !data || data.data.length === 0 ? (
        <div>No publications found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((pub: any) => (
            <PublicationCard
              key={pub.id}
              publication={pub}
              onEdit={() => setEditingPublicationId(pub.id)}
            />
          ))}
        </div>
      )}

      <ResourceCrudDialog
        isOpen={dialogState.open && dialogState.type === "create"}
        onOpenChange={(isOpen) =>
          setDialogState({ ...dialogState, open: isOpen })
        }
        title="Create Publication"
        description="Add a new article, paper, or report to the knowledge base."
        form={CreatePublicationForm}
        resourcePath="publications"
        resourceKey={["publications"]}
      />
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
    </ListPageLayout>
  );
}
