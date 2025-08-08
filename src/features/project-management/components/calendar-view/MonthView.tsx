import { Task } from "@/types";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import { CalendarTaskItem } from "./CalendarTaskItem";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  tasks: Task[];
  currentDate: Date;
  onTaskSelect: (taskId: string) => void;
}

function DayCell({
  day,
  isCurrentMonth,
  tasks,
  onTaskSelect,
}: {
  day: Date;
  isCurrentMonth: boolean;
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
        isCurrentMonth ? "" : "bg-background/50",
        isOver && "drag-over-day"
      )}
    >
      <span
        className={`self-start text-sm font-medium ${
          isToday
            ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
            : "text-foreground"
        }`}
      >
        {format(day, "d")}
      </span>
      <div className="mt-1 flex-grow space-y-1 overflow-y-auto">
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

export function MonthView({
  tasks,
  currentDate,
  onTaskSelect,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border text-center font-medium text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-3">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const tasksForDay = tasks.filter(
            (task) => task.dueDate && isSameDay(new Date(task.dueDate), day)
          );

          return (
            <DayCell
              key={day.toString()}
              day={day}
              isCurrentMonth={isCurrentMonth}
              tasks={tasksForDay}
              onTaskSelect={onTaskSelect}
            />
          );
        })}
      </div>
    </div>
  );
}
