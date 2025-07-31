import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useManageDeals } from "../api/useManageDeals";
import { Skeleton } from "@/components/ui/skeleton";
import { DealDetailContent } from "./DealDetailContent";

interface DealDetailPanelProps {
  dealId: string | null;
  onOpenChange: (isOpen: boolean) => void;
}

export function DealDetailPanel({
  dealId,
  onOpenChange,
}: DealDetailPanelProps) {
  const { useGetOne } = useManageDeals();
  const { data: deal, isLoading } = useGetOne(dealId);

  return (
    <Sheet open={!!dealId} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : deal ? (
          <DealDetailContent deal={deal} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p>Could not load deal details.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}