import { useMemo, useState } from "react";
import { Task } from "@/types";
import { TaskStatus } from "@/types/api";
import { ListViewHeader } from "./ListViewHeader";
import { TaskGroup } from "./TaskGroup";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { KanbanTaskCard } from "../kanban-view/KanbanTaskCard";
import { useSetTaskParent } from "../../api/useUpdateTask";

interface ListViewProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  emptyState: React.ReactNode;
  showWorkspaceColumn?: boolean;
  showProjectColumn?: boolean;
  showTaskTypeColumn?: boolean;
  selectedTaskIds: string[];
  setSelectedTaskIds: (ids: string[]) => void;
}

const statusOrder: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
  TaskStatus.BLOCKED,
  TaskStatus.CANCELLED,
];

const getStatusGroupName = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.TODO:
      return "To Do";
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.IN_REVIEW:
      return "In Review";
    case TaskStatus.DONE:
      return "Done";
    case TaskStatus.BLOCKED:
      return "Blocked";
    case TaskStatus.CANCELLED:
      return "Cancelled";
    default:
      return "Other";
  }
};

export function ListView({
  tasks,
  onTaskSelect,
  onTaskUpdate,
  emptyState,
  showWorkspaceColumn = false,
  showProjectColumn = false,
  showTaskTypeColumn = false,
  selectedTaskIds,
  setSelectedTaskIds,
}: ListViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const setParentMutation = useSetTaskParent();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragStart = (event: any) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const draggedTask = active.data.current?.task as Task;
      const targetTask = over.data.current?.task as Task;

      if (draggedTask && targetTask) {
        setParentMutation.mutate({
          taskId: draggedTask.id,
          parentId: targetTask.id,
          workspaceId: draggedTask.workspaceId,
          projectId: draggedTask.projectId,
        });
      }
    }
  };

  const groupedTasks = useMemo(() => {
    const groupMap = new Map<string, Task[]>();
    const topLevelTasks = tasks.filter((task) => !task.parentId);

    topLevelTasks.forEach((task) => {
      const groupName = getStatusGroupName(task.status);
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, []);
      }
      groupMap.get(groupName)!.push(task);
    });

    const orderedGroups: [string, Task[]][] = [];
    for (const status of statusOrder) {
      const groupName = getStatusGroupName(status);
      if (groupMap.has(groupName)) {
        orderedGroups.push([groupName, groupMap.get(groupName)!]);
      }
    }

    return orderedGroups;
  }, [tasks]);

  if (tasks.length === 0) {
    return emptyState;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="rounded-lg border border-border bg-surface">
        <ListViewHeader
          showWorkspace={showWorkspaceColumn}
          showProject={showProjectColumn}
          showTaskType={showTaskTypeColumn}
          tasks={tasks}
          selectedTaskIds={selectedTaskIds}
          setSelectedTaskIds={setSelectedTaskIds}
        />
        <div id="task-list">
          {groupedTasks.map(([groupName, tasksInGroup]) => (
            <TaskGroup
              key={groupName}
              groupName={groupName}
              tasks={tasksInGroup}
              onTaskSelect={onTaskSelect}
              onTaskUpdate={onTaskUpdate}
              showWorkspace={showWorkspaceColumn}
              showProject={showProjectColumn}
              showTaskType={showTaskTypeColumn}
              selectedTaskIds={selectedTaskIds}
              setSelectedTaskIds={setSelectedTaskIds}
            />
          ))}
        </div>
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