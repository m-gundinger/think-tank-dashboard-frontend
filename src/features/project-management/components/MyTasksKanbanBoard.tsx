import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { Task } from "@/types";
import { TaskStatus } from "@/types/api";
import { KanbanColumn } from "@/features/project-management/components/KanbanColumn";
import { KanbanTaskCard } from "@/features/project-management/components/KanbanTaskCard";
import { useUpdateMyTask } from "../api/useUpdateMyTask";

interface MyTasksKanbanBoardProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}

const KANBAN_COLUMNS = [
  {
    id: "col-todo",
    name: "To Do",
    status: TaskStatus.TODO,
    order: 1,
    viewId: "my-tasks-view",
  },
  {
    id: "col-in-progress",
    name: "In Progress",
    status: TaskStatus.IN_PROGRESS,
    order: 2,
    viewId: "my-tasks-view",
  },
  {
    id: "col-in-review",
    name: "In Review",
    status: TaskStatus.IN_REVIEW,
    order: 3,
    viewId: "my-tasks-view",
  },
  {
    id: "col-done",
    name: "Done",
    status: TaskStatus.DONE,
    order: 4,
    viewId: "my-tasks-view",
  },
];

export function MyTasksKanbanBoard({
  tasks,
  onTaskSelect,
}: MyTasksKanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateTaskMutation = useUpdateMyTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    KANBAN_COLUMNS.forEach((col) => (grouped[col.id] = []));

    tasks.forEach((task) => {
      const column = KANBAN_COLUMNS.find((col) => col.status === task.status);
      if (column) {
        grouped[column.id].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const onDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const targetColumnId =
      over.data.current?.sortable?.containerId?.toString() ??
      over.id.toString();
    const targetColumn = KANBAN_COLUMNS.find(
      (col) => col.id === targetColumnId
    );

    if (targetColumn && task.status !== targetColumn.status) {
      updateTaskMutation.mutate({
        taskId: task.id,
        workspaceId: task.workspaceId,
        projectId: task.projectId,
        taskData: { status: targetColumn.status },
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto p-1">
        {KANBAN_COLUMNS.map((col) => (
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
