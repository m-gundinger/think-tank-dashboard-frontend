import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Deal, DealStage } from "../crm.types";
import { DealCard } from "./DealCard";

interface DealColumnProps {
  stage: DealStage;
  deals: Deal[];
  onDealSelect: (dealId: string) => void;
}

export function DealColumn({ stage, deals, onDealSelect }: DealColumnProps) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
    data: {
      type: "DealStage",
      stage,
    },
  });

  const dealIds = deals.map((d) => d.id);

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div
      ref={setNodeRef}
      className="flex w-72 shrink-0 flex-col rounded-lg bg-gray-100/60 p-2"
    >
      <div className="p-2">
        <h3 className="font-semibold text-gray-700">{stage.name}</h3>
        <p className="text-sm text-gray-500">
          {currencyFormatter.format(totalValue)} ({deals.length})
        </p>
      </div>
      <div className="flex-grow space-y-2 overflow-y-auto">
        <SortableContext items={dealIds}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onSelect={onDealSelect} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
