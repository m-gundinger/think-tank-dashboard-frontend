import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useGetPerson } from "../api/useGetPerson";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonDetailContent } from "./PersonDetailContent";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useDeletePerson } from "../api/useDeletePerson";

interface PersonDetailPanelProps {
  personId: string | null;
  onOpenChange: (isOpen: boolean) => void;
}

const PanelSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-12 w-full" />
  </div>
);

export function PersonDetailPanel({
  personId,
  onOpenChange,
}: PersonDetailPanelProps) {
  const { data: person, isLoading } = useGetPerson(personId!);
  const deleteMutation = useDeletePerson();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      deleteMutation.mutate(person.id, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Sheet open={!!personId} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        {isLoading ? (
          <PanelSkeleton />
        ) : person ? (
          <>
            <SheetHeader>
              <SheetTitle>{`${person.firstName} ${person.lastName}`}</SheetTitle>
              <SheetDescription>{person.email}</SheetDescription>
            </SheetHeader>
            <div className="h-[calc(100vh-8rem)] flex-1 overflow-y-auto py-4 pr-4">
              <PersonDetailContent person={person} />
            </div>
            <SheetFooter className="mt-auto border-t pt-4">
              <div className="flex w-full justify-end gap-2">
                <Button variant="outline">
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
          <div className="p-6">Could not load person details.</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
