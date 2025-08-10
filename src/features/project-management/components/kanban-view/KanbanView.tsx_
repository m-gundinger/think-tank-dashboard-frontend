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
import { Task } from "@/types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { useMoveTask } from "@/features/project-management/api/useMoveTask";
import { ViewColumn } from "@/types";
import { TaskStatus } from "@/types/api";
import { EmptyState } from "@/components/ui/empty-state";
import { Kanban, PlusCircle } from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { useUpdateTask } from "../../api/useUpdateTask";

interface KanbanViewProps {
  scope: "user" | "project";
  workspaceId?: string;
  projectId?: string;
  columns: ViewColumn[];
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  columnStatusMap?: Record<string, TaskStatus>;
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

export function KanbanView({
  scope,
  workspaceId,
  projectId,
  columns,
  tasks,
  onTaskSelect,
  columnStatusMap,
}: KanbanViewProps) {
  const moveTaskMutation = useMoveTask(projectId);
  const updateTaskMutation = useUpdateTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
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
      if (scope === "user" && columnStatusMap) {
        const targetCol = columns.find(
          (c) => columnStatusMap[c.id] === task.status
        );
        if (targetCol) {
          targetColumnId = targetCol.id;
        }
      } else if (!targetColumnId) {
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
  }, [tasks, columns, scope, columnStatusMap]);

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
    if (!over || !activeTask || active.id === over.id) return;

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
    if (!over) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const destColumnId =
      over.data.current?.sortable?.containerId?.toString() ??
      over.id.toString();
    const destColumn = columns.find((col: any) => col.id === destColumnId);
    if (!destColumn) return;

    // Manually update local state for immediate feedback
    const sourceColumnId = findColumnForTask(active.id as string);
    if (sourceColumnId) {
      setTasksByColumn((prev) => {
        const newTasksByColumn = { ...prev };
        const sourceItems =
          newTasksByColumn[sourceColumnId]?.filter((t) => t.id !== active.id) ||
          [];
        const destItems = [
          ...(newTasksByColumn[destColumnId] || []),
          draggedTask,
        ];
        newTasksByColumn[sourceColumnId] = sourceItems;
        newTasksByColumn[destColumnId] = destItems;
        return newTasksByColumn;
      });
    }

    if (scope === "project") {
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
    } else if (scope === "user" && columnStatusMap) {
      const newStatus = columnStatusMap[destColumnId];
      if (newStatus && draggedTask.status !== newStatus) {
        updateTaskMutation.mutate({
          taskId: draggedTask.id,
          workspaceId: draggedTask.workspaceId,
          projectId: draggedTask.projectId,
          taskData: { status: newStatus },
        });
      }
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
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex h-full gap-4 overflow-x-auto bg-background p-1">
          {columns.map((col: ViewColumn) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasksByColumn[col.id] || []}
              onTaskSelect={onTaskSelect}
            />
          ))}
          {projectId && (
            <div>
              <Button
                variant="outline"
                className="w-72 border-slate-700 bg-surface text-slate-300 hover:bg-slate-700 hover:text-white"
                disabled // This would require a "Create Column" dialog which is out of scope for now.
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add another list
              </Button>
            </div>
          )}
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
    </>
  );
}
