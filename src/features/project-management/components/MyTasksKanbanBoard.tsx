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

interface MyTasksKanbanBoardProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}

const KANBAN_COLUMNS: Omit<ViewColumn, "createdAt" | "updatedAt">[] = [
  {
    id: "col-todo",
    name: "To Do",
    order: 1,
    viewId: "my-tasks-view",
  },
  {
    id: "col-in-progress",
    name: "In Progress",
    order: 2,
    viewId: "my-tasks-view",
  },
  {
    id: "col-in-review",
    name: "In Review",
    order: 3,
    viewId: "my-tasks-view",
  },
  {
    id: "col-done",
    name: "Done",
    order: 4,
    viewId: "my-tasks-view",
  },
];

const columnStatusMap: Record<string, TaskStatus> = {
  "col-todo": TaskStatus.TODO,
  "col-in-progress": TaskStatus.IN_PROGRESS,
  "col-in-review": TaskStatus.IN_REVIEW,
  "col-done": TaskStatus.DONE,
};

export function MyTasksKanbanBoard({
  tasks,
  onTaskSelect,
}: MyTasksKanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateTaskMutation = useUpdateTask();
  const [tasksByColumn, setTasksByColumn] = useState<Record<string, Task[]>>(
    {}
  );

  useEffect(() => {
    const grouped: Record<string, Task[]> = {};
    KANBAN_COLUMNS.forEach((col) => (grouped[col.id] = []));

    tasks.forEach((task) => {
      const column = KANBAN_COLUMNS.find(
        (col) => columnStatusMap[col.id] === task.status
      );
      if (column) {
        grouped[column.id].push(task);
      } else {
        // Fallback for any other statuses
        if (!grouped["col-todo"]) grouped["col-todo"] = [];
        grouped["col-todo"].push(task);
      }
    });
    setTasksByColumn(grouped);
  }, [tasks]);

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
    if (!over || active.id === over.id || !activeTask) return;

    const sourceColumnId = findColumnForTask(active.id as string);
    const destColumnId =
      over.data.current?.type === "Column"
        ? (over.id as string)
        : findColumnForTask(over.id as string);

    if (!sourceColumnId || !destColumnId || sourceColumnId === destColumnId) {
      return;
    }

    setTasksByColumn((prev) => {
      const sourceItems = [...(prev[sourceColumnId] || [])];
      const destItems = [...(prev[destColumnId] || [])];
      const activeIndex = sourceItems.findIndex((t) => t.id === active.id);

      if (activeIndex === -1) return prev;

      sourceItems.splice(activeIndex, 1);
      const overIndex = destItems.findIndex((t) => t.id === over.id);

      if (overIndex !== -1) {
        destItems.splice(overIndex, 0, activeTask);
      } else {
        destItems.push(activeTask);
      }

      return {
        ...prev,
        [sourceColumnId]: sourceItems,
        [destColumnId]: destItems,
      };
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const destColumnId =
      over.data.current?.sortable?.containerId?.toString() ??
      over.id.toString();

    const targetColumn = KANBAN_COLUMNS.find((col) => col.id === destColumnId);

    if (targetColumn && task.status !== columnStatusMap[targetColumn.id]) {
      updateTaskMutation.mutate({
        taskId: task.id,
        workspaceId: task.workspaceId,
        projectId: task.projectId,
        taskData: { status: columnStatusMap[targetColumn.id] },
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
        {KANBAN_COLUMNS.map((col) => (
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
            <KanbanTaskCard task={activeTask} onTaskSelect={() => {}} />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
