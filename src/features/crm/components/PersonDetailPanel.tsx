import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { useApiResource } from "@/hooks/useApiResource";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonDetailContent } from "./PersonDetailContent";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { PersonForm } from "./PersonForm";

interface PersonDetailPanelProps {
  personId: string | null;
  onOpenChange: (isOpen: boolean) => void;
}

const PanelSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="flex flex-col items-center gap-4 pt-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="w-full space-y-2">
        <Skeleton className="mx-auto h-7 w-48" />
        <Skeleton className="mx-auto h-4 w-32" />
      </div>
    </div>
    <hr />
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-20 w-full" />
    <hr />
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-12 w-full" />
  </div>
);
export function PersonDetailPanel({
  personId,
  onOpenChange,
}: PersonDetailPanelProps) {
  const personResource = useApiResource("people", ["people"]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: person, isLoading } = personResource.useGetOne(personId);
  const deleteMutation = personResource.useDelete();
  const handleDelete = () => {
    if (
      person &&
      window.confirm(`Are you sure you want to delete ${person.name}?`)
    ) {
      deleteMutation.mutate(person.id, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <>
      <Sheet open={!!personId} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
          {isLoading ? (
            <PanelSkeleton />
          ) : person ? (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <PersonDetailContent person={person} />
              </div>
              <SheetFooter className="bg-background mt-auto border-t p-4">
                <div className="flex w-full justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </SheetFooter>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p>Could not load person details.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <ResourceCrudDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Person"
        description="Make changes to the person's details."
        form={PersonForm}
        resourcePath="people"
        resourceKey={["people"]}
        resourceId={person?.id}
      />
    </>
  );
}
