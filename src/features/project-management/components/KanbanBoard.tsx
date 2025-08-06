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
import { Task } from "@/types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { useMoveTask } from "@/features/project-management/api/useMoveTask";
import { View, ViewColumn } from "@/types";
import { TaskStatus } from "@/types/api";
import { useMemo, useState, useEffect } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Kanban } from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";

interface KanbanBoardProps {
  workspaceId: string;
  projectId: string;
  views: View[];
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}

function mapColumnNameToStatus(columnName: string): TaskStatus | null {
  const normalizedName = columnName.trim().toUpperCase().replace(/\s+/g, "_");
  if (normalizedName === "TO_DO") return TaskStatus.TODO;
  if (Object.values(TaskStatus).includes(normalizedName as TaskStatus)) {
    return normalizedName as TaskStatus;
  }
  return null;
}

function mapStatusToColumnName(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return "To Do";
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.IN_REVIEW:
      return "In Review";
    case TaskStatus.DONE:
      return "Done";
    default:
      return "";
  }
}

export function KanbanBoard({
  workspaceId,
  projectId,
  views,
  tasks,
  onTaskSelect,
}: KanbanBoardProps) {
  const moveTaskMutation = useMoveTask(projectId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columns = useMemo(() => {
    const kanbanView = views.find((v) => v.type === "KANBAN");
    return kanbanView?.columns || [];
  }, [views]);

  const [tasksByColumn, setTasksByColumn] = useState<Record<string, Task[]>>(
    {}
  );

  useEffect(() => {
    const grouped = columns.reduce(
      (acc: Record<string, Task[]>, col: ViewColumn) => {
        acc[col.id] = [];
        return acc;
      },
      {} as Record<string, Task[]>
    );

    const topLevelTasks = tasks.filter((task) => !task.parentId);

    topLevelTasks.forEach((task) => {
      let targetColumnId = task.boardColumnId;
      if (!targetColumnId) {
        const expectedColumnName = mapStatusToColumnName(task.status);
        const fallbackColumn = columns.find(
          (c: ViewColumn) =>
            c.name.toUpperCase() === expectedColumnName.toUpperCase()
        );
        if (fallbackColumn) {
          targetColumnId = fallbackColumn.id;
        }
      }

      if (targetColumnId && grouped[targetColumnId]) {
        grouped[targetColumnId].push(task);
      }
    });

    for (const columnId in grouped) {
      grouped[columnId].sort(
        (a, b) => (a.orderInColumn || 0) - (b.orderInColumn || 0)
      );
    }
    setTasksByColumn(grouped);
  }, [tasks, columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const findColumnForTask = (taskId: string) => {
    for (const colId in tasksByColumn) {
      if (tasksByColumn[colId].some((task) => task.id === taskId)) {
        return colId;
      }
    }
    return null;
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !activeTask) return;

    const sourceColumnId = findColumnForTask(active.id as string);
    const destColumnId =
      over.data.current?.type === "Column"
        ? (over.id as string)
        : findColumnForTask(over.id as string);

    if (!sourceColumnId || !destColumnId) {
      return;
    }

    if (sourceColumnId !== destColumnId) {
      setTasksByColumn((prev) => {
        const sourceItems = [...(prev[sourceColumnId] || [])];
        const destItems = [...(prev[destColumnId] || [])];
        const activeIndex = sourceItems.findIndex((t) => t.id === active.id);

        if (activeIndex === -1) return prev;

        const [movedItem] = sourceItems.splice(activeIndex, 1);
        const overIndex = destItems.findIndex((t) => t.id === over.id);

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
    if (!over || active.id === over.id) return;

    const draggedTask = active.data.current?.task as Task;
    if (!draggedTask) return;

    const destColumnId =
      over.data.current?.sortable?.containerId?.toString() ??
      over.id.toString();
    const destColumn = columns.find((col: any) => col.id === destColumnId);
    if (!destColumn) return;

    const tasksInDestColumn = (tasksByColumn[destColumnId] || []).sort(
      (a, b) => (a.orderInColumn || 0) - (b.orderInColumn || 0)
    );
    const overIsTask = over.data.current?.type === "Task";
    let newOrderInColumn: number;

    if (overIsTask) {
      const overTaskIndex = tasksInDestColumn.findIndex(
        (t) => t.id === over.id
      );
      if (overTaskIndex !== -1) {
        const overTask = tasksInDestColumn[overTaskIndex];
        const prevTask = tasksInDestColumn[overTaskIndex - 1];
        const prevOrder = prevTask?.orderInColumn ?? 0;
        const overOrder = overTask?.orderInColumn ?? prevOrder + 2000;
        newOrderInColumn = (prevOrder + overOrder) / 2;
      } else {
        const lastTask = tasksInDestColumn[tasksInDestColumn.length - 1];
        newOrderInColumn = (lastTask?.orderInColumn || 0) + 1000;
      }
    } else {
      const lastTask = tasksInDestColumn[tasksInDestColumn.length - 1];
      newOrderInColumn = (lastTask?.orderInColumn || 0) + 1000;
    }

    const newStatus = mapColumnNameToStatus(destColumn.name);
    moveTaskMutation.mutate({
      workspaceId,
      projectId,
      taskId: active.id as string,
      targetColumnId: destColumnId,
      newStatus,
      orderInColumn: newOrderInColumn,
    });
  };

  if (columns.length === 0) {
    return (
      <EmptyState
        icon={<Kanban />}
        title="Kanban Board Not Configured"
        description="This Kanban view has no columns. Please edit the view in project settings."
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto p-1">
        {columns.map((col: ViewColumn) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasksByColumn[col.id] || []}
            onTaskSelect={onTaskSelect}
          />
        ))}
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