import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  closestCorners,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { Deal } from "@/types";
import { DealColumn } from "./DealColumn";
import { DealCard } from "./DealCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useManageDealStages } from "../api/useManageDealStages";
import { useManageDeals } from "../api/useManageDeals";
import { arrayMove } from "@dnd-kit/sortable";

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

  const [tasksByColumn, setTasksByColumn] = useState<Record<string, Deal[]>>(
    {}
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    if (!stagesData?.data || !dealsData?.data) {
      setTasksByColumn({});
      return;
    }
    const grouped: Record<string, Deal[]> = {};
    stagesData.data.forEach((stage: any) => (grouped[stage.id] = []));
    dealsData.data.forEach((deal: any) => {
      if (grouped[deal.stageId]) {
        grouped[deal.stageId].push(deal);
      }
    });
    setTasksByColumn(grouped);
  }, [stagesData, dealsData]);

  const findColumnForTask = (taskId: string) => {
    return Object.keys(tasksByColumn).find((colId) =>
      tasksByColumn[colId].some((task) => task.id === taskId)
    );
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Deal") {
      setActiveDeal(event.active.data.current.deal);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activeDeal || active.id === over.id) return;

    const sourceColumnId = findColumnForTask(active.id as string);
    const destColumnId =
      over.data.current?.type === "DealStage"
        ? (over.id as string)
        : findColumnForTask(over.id as string);

    if (!sourceColumnId || !destColumnId) return;

    if (sourceColumnId !== destColumnId) {
      setTasksByColumn((prev) => {
        const sourceItems = prev[sourceColumnId] || [];
        const destItems = prev[destColumnId] || [];

        const activeIndex = sourceItems.findIndex((t) => t.id === active.id);
        if (activeIndex === -1) return prev;

        const [movedItem] = sourceItems.splice(activeIndex, 1);

        const overIsTask = over.data.current?.type === "Deal";
        let overIndex = -1;
        if (overIsTask) {
          overIndex = destItems.findIndex((t) => t.id === over.id);
        }

        if (overIndex !== -1) {
          destItems.splice(overIndex, 0, movedItem);
        } else {
          destItems.push(movedItem);
        }

        return {
          ...prev,
          [sourceColumnId]: sourceItems,
          [destColumnId]: destItems,
        };
      });
    } else {
      setTasksByColumn((prev) => {
        const items = prev[sourceColumnId];
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          return {
            ...prev,
            [sourceColumnId]: arrayMove(items, oldIndex, newIndex),
          };
        }
        return prev;
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const deal = active.data.current?.deal as Deal;
    const destColumnId =
      over.data.current?.type === "DealStage"
        ? (over.id as string)
        : findColumnForTask(over.id as string);

    if (deal && destColumnId && deal.stageId !== destColumnId) {
      updateDealMutation.mutate({
        id: deal.id,
        data: { stageId: destColumnId },
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
      onDragOver={onDragOver}
      collisionDetection={closestCorners}
    >
      <div className="flex h-[calc(100vh-250px)] gap-4 overflow-x-auto p-1">
        {stagesData?.data
          ?.sort((a: any, b: any) => a.order - b.order)
          .map((stage: any) => (
            <DealColumn
              key={stage.id}
              stage={stage}
              deals={tasksByColumn[stage.id] || []}
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