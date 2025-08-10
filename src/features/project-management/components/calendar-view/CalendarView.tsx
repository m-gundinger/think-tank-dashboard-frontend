import { useState, useCallback, useEffect } from "react";
import { Task } from "@/types";
import { CalendarToolbar } from "./CalendarToolbar";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { AgendaView } from "./AgendaView";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { CalendarTaskItem } from "./CalendarTaskItem";
import { useUpdateTask } from "../../api/useUpdateTask";
import { useParams } from "react-router-dom";

type View = "month" | "week" | "agenda";

interface CalendarViewProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function CalendarView({
  tasks,
  onTaskSelect,
  onTaskUpdate,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const updateTaskMutation = useUpdateTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleNavigate = useCallback(
    (action: "PREV" | "NEXT" | "TODAY") => {
      if (action === "TODAY") {
        setCurrentDate(new Date());
        return;
      }

      const newDate = new Date(currentDate);
      const increment = action === "PREV" ? -1 : 1;

      if (currentView === "month") {
        newDate.setMonth(newDate.getMonth() + increment);
      } else if (currentView === "week") {
        newDate.setDate(newDate.getDate() + 7 * increment);
      }
      setCurrentDate(newDate);
    },
    [currentDate, currentView]
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (
      !over ||
      active.id === over.id ||
      over.data.current?.type !== "date-cell"
    ) {
      return;
    }

    const taskId = active.id as string;
    const newDueDate = over.data.current?.date as Date;

    setLocalTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, dueDate: newDueDate.toISOString() }
          : task
      )
    );

    updateTaskMutation.mutate({
      taskId,
      workspaceId,
      projectId,
      taskData: { dueDate: newDueDate.toISOString() },
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full">
        <CalendarToolbar
          currentDate={currentDate}
          currentView={currentView}
          onNavigate={handleNavigate}
          onViewChange={setCurrentView}
        />
        <div className="rounded-lg bg-surface">
          {currentView === "month" && (
            <MonthView
              tasks={localTasks}
              currentDate={currentDate}
              onTaskSelect={onTaskSelect}
            />
          )}
          {currentView === "week" && (
            <WeekView
              tasks={localTasks}
              currentDate={currentDate}
              onTaskSelect={onTaskSelect}
            />
          )}
          {currentView === "agenda" && (
            <AgendaView
              tasks={tasks}
              onTaskSelect={onTaskSelect}
              onTaskUpdate={onTaskUpdate}
              selectedTaskIds={selectedTaskIds}
              setSelectedTaskIds={setSelectedTaskIds}
            />
          )}
        </div>
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <div className="dragging-card-overlay">
              <CalendarTaskItem task={activeTask} onTaskSelect={() => {}} />
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}