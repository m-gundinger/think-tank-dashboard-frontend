import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { useApiResource } from "@/hooks/useApiResource";
import { Deal } from "../crm.types";
import { DealColumn } from "./DealColumn";
import { DealCard } from "./DealCard";

interface DealPipelineProps {
  onDealSelect: (dealId: string) => void;
}

export function DealPipeline({ onDealSelect }: DealPipelineProps) {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const { data: stagesData, isLoading: isLoadingStages } = useApiResource(
    "deal-stages",
    ["dealStages"]
  ).useGetAll({ projectId: "YOUR_PROJECT_ID" });
  const { data: dealsData, isLoading: isLoadingDeals } = useApiResource(
    "deals",
    ["deals"]
  ).useGetAll();
  const dealResource = useApiResource("deals", ["deals"]);
  const updateDealMutation = dealResource.useUpdate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const dealsByStage = useMemo(() => {
    if (!stagesData?.data || !dealsData?.data) return {};
    const grouped: Record<string, Deal[]> = {};
    stagesData.data.forEach((stage: any) => (grouped[stage.id] = []));
    dealsData.data.forEach((deal: any) => {
      if (grouped[deal.stageId]) {
        grouped[deal.stageId].push(deal);
      }
    });
    return grouped;
  }, [stagesData, dealsData]);
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Deal") {
      setActiveDeal(event.active.data.current.deal);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const deal = active.data.current?.deal as Deal;
    const targetStageId = over.id as string;

    if (deal && targetStageId && deal.stageId !== targetStageId) {
      updateDealMutation.mutate({
        id: deal.id,
        data: { stageId: targetStageId },
      });
    }
  };

  if (isLoadingStages || isLoadingDeals) {
    return <div>Loading deal pipeline...</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-[calc(100vh-250px)] gap-4 overflow-x-auto p-1">
        {stagesData?.data?.map((stage: any) => (
          <DealColumn
            key={stage.id}
            stage={stage}
            deals={dealsByStage[stage.id] || []}
            onDealSelect={onDealSelect}
          />
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {activeDeal ? (
            <DealCard deal={activeDeal} onSelect={onDealSelect} />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}