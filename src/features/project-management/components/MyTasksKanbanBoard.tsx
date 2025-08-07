import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  closestCorners,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { Task } from "@/types";
import { TaskStatus } from "@/types/api";
import { KanbanColumn } from "@/features/project-management/components/KanbanColumn";
import { KanbanTaskCard } from "@/features/project-management/components/KanbanTaskCard";
import { useUpdateTask } from "../api/useUpdateTask";
import { ViewColumn } from "@/types";
import { arrayMove } from "@dnd-kit/sortable";

interface MyTasksKanbanBoardProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  columns: Omit<ViewColumn, "createdAt" | "updatedAt">[];
  columnStatusMap: Record<string, TaskStatus>;
}

export function MyTasksKanbanBoard({
  tasks,
  onTaskSelect,
  columns,
  columnStatusMap,
}: MyTasksKanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateTaskMutation = useUpdateTask();
  const [tasksByColumn, setTasksByColumn] = useState<Record<string, Task[]>>(
    {}
  );

  useEffect(() => {
    const grouped: Record<string, Task[]> = {};
    columns.forEach((col) => (grouped[col.id] = []));

    tasks.forEach((task) => {
      const column = columns.find(
        (col) => columnStatusMap[col.id] === task.status
      );
      if (column) {
        grouped[column.id].push(task);
      }
    });
    setTasksByColumn(grouped);
  }, [tasks, columns, columnStatusMap]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const findColumnForTask = (taskId: string) => {
    return Object.keys(tasksByColumn).find((colId) =>
      tasksByColumn[colId].some((task) => task.id === taskId)
    );
  };

  const onDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activeTask || active.id === over.id) return;

    const sourceColumnId = findColumnForTask(active.id as string);
    const destColumnId =
      over.data.current?.type === "Column"
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

        const overIsTask = over.data.current?.type === "Task";
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
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const destColumnId =
      over.data.current?.type === "Column"
        ? (over.id as string)
        : findColumnForTask(over.id as string);

    if (!destColumnId) return;

    const originalStatus = task.status;
    const newStatus = columnStatusMap[destColumnId];

    if (newStatus && originalStatus !== newStatus) {
      updateTaskMutation.mutate({
        taskId: task.id,
        workspaceId: task.workspaceId,
        projectId: task.projectId,
        taskData: { status: newStatus },
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto p-1">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col as ViewColumn}
            tasks={tasksByColumn[col.id] || []}
            onTaskSelect={onTaskSelect}
          />
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <div className="dragging-card-overlay">
              <KanbanTaskCard task={activeTask} onTaskSelect={() => {}} />
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}