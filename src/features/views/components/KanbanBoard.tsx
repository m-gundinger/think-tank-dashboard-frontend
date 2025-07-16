import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { useMoveTask } from "@/features/tasks/api/useMoveTask";
import { Task } from "@/features/tasks/task.types";
import { TaskStatus, View, ViewColumn } from "@/types";
import { createPortal } from "react-dom";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Kanban } from "lucide-react";

interface KanbanBoardProps {
  workspaceId: string;
  projectId: string;
  views: View[];
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
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

// This function now correctly handles parent and sub-task visibility.
const getDisplayableTasks = (tasks: Task[]): Task[] => {
  const displayable: Task[] = [];
  if (!tasks) return displayable;

  for (const task of tasks) {
    // If a task has no subtasks, it's always displayable.
    if (!task.subtasks || task.subtasks.length === 0) {
      displayable.push(task);
    } else {
      // If a task has subtasks, check if they are all done.
      const allSubtasksDone = task.subtasks.every(
        (sub) => sub.status === TaskStatus.DONE
      );

      // If all subtasks are done, display the parent task itself.
      if (allSubtasksDone) {
        displayable.push(task);
      } else {
        // Otherwise, don't show the parent, but recursively find
        // and show its individual (non-done) subtasks.
        displayable.push(...getDisplayableTasks(task.subtasks));
      }
    }
  }
  return displayable;
};

const flattenTasks = (tasksToFlatten: Task[]): Task[] => {
  let flat: Task[] = [];
  if (!tasksToFlatten) return flat;
  for (const task of tasksToFlatten) {
    flat.push(task);
    if (task.subtasks) {
      flat.push(...flattenTasks(task.subtasks));
    }
  }
  return flat;
};

function mapColumnNameToStatus(columnName: string): TaskStatus | null {
  const normalizedName = columnName.trim().toUpperCase().replace(/\s+/g, "_");
  if (normalizedName === "TO_DO") return TaskStatus.TODO;
  if (Object.values(TaskStatus).includes(normalizedName as TaskStatus)) {
    return normalizedName as TaskStatus;
  }
  return null;
}

export function KanbanBoard({
  workspaceId,
  projectId,
  views,
  tasks,
  onTaskSelect,
}: KanbanBoardProps) {
  const moveTaskMutation = useMoveTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const displayableTasks = useMemo(() => getDisplayableTasks(tasks), [tasks]);

  const columns = useMemo(() => {
    const kanbanView = views.find((v) => v.type === "KANBAN");
    return kanbanView?.columns || [];
  }, [views]);

  const tasksByColumn = useMemo(() => {
    const grouped = columns.reduce(
      (acc: Record<string, Task[]>, col: ViewColumn) => {
        acc[col.id] = [];
        return acc;
      },
      {} as Record<string, Task[]>
    );

    displayableTasks.forEach((task) => {
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

    return grouped;
  }, [columns, displayableTasks]);

  const onDragStart = (event: DragStartEvent) => {
    const allTasksFlat = flattenTasks(tasks);
    const task = allTasksFlat.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const allTasksFlat = flattenTasks(tasks);
    const draggedTask = allTasksFlat.find((t) => t.id === active.id);
    const targetColumnId =
      over.data.current?.sortable?.containerId || over.id.toString();
    const targetColumn = columns.find((col: any) => col.id === targetColumnId);
    if (draggedTask && targetColumnId && targetColumn) {
      const newStatus = mapColumnNameToStatus(targetColumn.name);
      moveTaskMutation.mutate({
        workspaceId,
        projectId,
        taskId: active.id as string,
        targetColumnId: targetColumnId,
        newStatus: newStatus,
        orderInColumn: 0,
      });
    }
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
      onDragStart={onDragStart}
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
