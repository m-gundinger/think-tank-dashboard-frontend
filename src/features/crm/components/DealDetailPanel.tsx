import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { useManageDeals } from "../api/useManageDeals";
import { Skeleton } from "@/components/ui/skeleton";
import { DealDetailContent } from "./DealDetailContent";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { DealForm } from "./DealForm";
interface DealDetailPanelProps {
  dealId: string | null;
  onOpenChange: (isOpen: boolean) => void;
}

const PanelSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="flex flex-col items-center gap-4 pt-4">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <hr />
    <Skeleton className="h-20 w-full" />
    <hr />
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export function DealDetailPanel({
  dealId,
  onOpenChange,
}: DealDetailPanelProps) {
  const dealResource = useManageDeals();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: deal, isLoading } = dealResource.useGetOne(dealId);
  const deleteMutation = dealResource.useDelete();

  const handleDelete = () => {
    if (
      deal &&
      window.confirm(`Are you sure you want to delete ${deal.name}?`)
    ) {
      deleteMutation.mutate(deal.id, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <>
      <Sheet open={!!dealId} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
          {isLoading ? (
            <PanelSkeleton />
          ) : deal ? (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <DealDetailContent deal={deal} />
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
              <p>Could not load deal details.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <ResourceCrudDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Deal"
        description="Make changes to the deal's details."
        form={DealForm}
        formProps={{
          projectId: deal?.projectId,
          workspaceId: deal?.workspaceId,
        }}
        resourcePath="deals"
        resourceKey={["deals"]}
        resourceId={deal?.id}
      />
    </>
  );
}
