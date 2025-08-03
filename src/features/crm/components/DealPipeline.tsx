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
import { Deal } from "@/types";
import { DealColumn } from "./DealColumn";
import { DealCard } from "./DealCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useManageDealStages } from "../api/useManageDealStages";
import { useManageDeals } from "../api/useManageDeals";

interface DealPipelineProps {
  onDealSelect: (dealId: string) => void;
  projectId?: string;
}

const PipelineSkeleton = () => (
  <div className="flex gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="w-72 shrink-0 space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    ))}
  </div>
);

export function DealPipeline({ onDealSelect, projectId }: DealPipelineProps) {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const { data: stagesData, isLoading: isLoadingStages } = useManageDealStages(
    projectId
  ).useGetAll({ enabled: !!projectId });
  const { data: dealsData, isLoading: isLoadingDeals } =
    useManageDeals().useGetAll();
  const { useUpdate } = useManageDeals();
  const updateDealMutation = useUpdate();

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

    const isMovingToDifferentColumn =
      deal.stageId !== targetStageId && over.data.current?.type === "DealStage";

    if (deal && isMovingToDifferentColumn) {
      updateDealMutation.mutate({
        id: deal.id,
        data: { stageId: targetStageId },
      });
    }
  };

  if (isLoadingStages || isLoadingDeals) {
    return <PipelineSkeleton />;
  }

  if (!stagesData?.data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          Could not load deal stages. Please select a project context if
          available.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-[calc(100vh-250px)] gap-4 overflow-x-auto p-1">
        {stagesData?.data
          ?.sort((a: any, b: any) => a.order - b.order)
          .map((stage: any) => (
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