import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { useApiResource } from "@/hooks/useApiResource";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { OrganizationForm } from "./OrganizationForm";
import { OrganizationDetailContent } from "./OrganizationDetailContent";

interface OrganizationDetailPanelProps {
  organizationId: string | null;
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
export function OrganizationDetailPanel({
  organizationId,
  onOpenChange,
}: OrganizationDetailPanelProps) {
  const organizationResource = useApiResource("organizations", [
    "organizations",
  ]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: organization, isLoading } =
    organizationResource.useGetOne(organizationId);
  const deleteMutation = organizationResource.useDelete();
  const handleDelete = () => {
    if (
      organization &&
      window.confirm(`Are you sure you want to delete ${organization.name}?`)
    ) {
      deleteMutation.mutate(organization.id, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <>
      <Sheet open={!!organizationId} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
          {isLoading ? (
            <PanelSkeleton />
          ) : organization ? (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <OrganizationDetailContent organization={organization} />
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
              <p>Could not load organization details.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <ResourceCrudDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Organization"
        description="Make changes to the organization's details."
        form={OrganizationForm}
        resourcePath="organizations"
        resourceKey={["organizations"]}
        resourceId={organization?.id}
      />
    </>
  );
}