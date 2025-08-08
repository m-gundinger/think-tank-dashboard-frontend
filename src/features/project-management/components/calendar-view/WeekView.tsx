import { Task } from "@/types";
import {
  startOfWeek,
  eachDayOfInterval,
  isSameDay,
  format,
  endOfWeek,
} from "date-fns";
import { CalendarTaskItem } from "./CalendarTaskItem";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  tasks: Task[];
  currentDate: Date;
  onTaskSelect: (taskId: string) => void;
}

function DayColumn({
  day,
  tasks,
  onTaskSelect,
}: {
  day: Date;
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.toISOString(),
    data: {
      type: "date-cell",
      date: day,
    },
  });

  const isToday = isSameDay(day, new Date());
  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "calendar-day relative flex flex-col p-2",
        isToday ? "bg-hover" : "",
        isOver && "drag-over-day"
      )}
    >
      <div className="flex-grow space-y-2 overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <CalendarTaskItem
              key={task.id}
              task={task}
              onTaskSelect={onTaskSelect}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function WeekView({ tasks, currentDate, onTaskSelect }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border text-center font-medium text-muted-foreground">
        {days.map((day) => (
          <div key={day.toString()} className="py-3">
            {format(day, "EEE")}{" "}
            <span className="text-foreground">{format(day, "d")}</span>
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const tasksForDay = tasks.filter(
            (task) => task.dueDate && isSameDay(new Date(task.dueDate), day)
          );

          return (
            <DayColumn
              key={day.toString()}
              day={day}
              tasks={tasksForDay}
              onTaskSelect={onTaskSelect}
            />
          );
        })}
      </div>
    </div>
  );
}