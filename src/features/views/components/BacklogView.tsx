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
import { Task } from "@/types";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { useState } from "react";

interface BacklogViewProps {
  tasks: Task[];
  workspaceId: string;
  projectId: string;
  onTaskSelect: (taskId: string) => void;
}

export function BacklogView({ tasks }: BacklogViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId) as Task & {
      epicId?: string;
    };
    if (!task) return;
  };
  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Backlog</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-2"></div>
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <KanbanTaskCard task={activeTask} onTaskSelect={() => {}} />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}