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
import { Task } from "@/features/tasks/task.types";
import { useApiResource } from "@/hooks/useApiResource";
import { useUpdateMyTask } from "@/features/tasks/api/useUpdateMyTask";
import { EpicDropzone } from "./EpicDropzone";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { useState, useMemo } from "react";

interface BacklogViewProps {
  tasks: Task[];
  workspaceId: string;
  projectId: string;
  onTaskSelect: (taskId: string) => void;
}

export function BacklogView({
  tasks,
  workspaceId,
  projectId,
  onTaskSelect,
}: BacklogViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateTaskMutation = useUpdateMyTask();

  const { data: epicsData } = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/epics`,
    ["epics", projectId]
  ).useGetAll();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const { tasksWithoutEpic, tasksByEpic } = useMemo(() => {
    const tasksWithoutEpic: Task[] = [];
    const tasksByEpic: Record<string, Task[]> = {};
    tasks.forEach((task) => {
      if (task.epicId) {
        if (!tasksByEpic[task.epicId]) {
          tasksByEpic[task.epicId] = [];
        }
        tasksByEpic[task.epicId].push(task);
      } else {
        tasksWithoutEpic.push(task);
      }
    });
    return { tasksWithoutEpic, tasksByEpic };
  }, [tasks]);
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
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const targetIsEpic = over.data.current?.type === "Epic";
    const newEpicId = targetIsEpic
      ? (over.id as string).replace("epic-", "")
      : null;
    if (task.epicId !== newEpicId) {
      updateTaskMutation.mutate({
        taskId,
        workspaceId,
        projectId,
        taskData: { epicId: newEpicId },
      });
    }
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
          <EpicDropzone
            epic={{ id: "backlog", name: "Tasks without Epic" }}
            tasks={tasksWithoutEpic}
            onTaskSelect={onTaskSelect}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-2">
          {epicsData?.data?.map((epic: any) => (
            <EpicDropzone
              key={epic.id}
              epic={epic}
              tasks={tasksByEpic[epic.id] || []}
              onTaskSelect={onTaskSelect}
            />
          ))}
        </div>
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