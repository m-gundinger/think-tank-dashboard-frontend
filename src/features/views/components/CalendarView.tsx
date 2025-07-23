import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { Task } from "@/features/tasks/task.types";

interface CalendarViewProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
export function CalendarView({ tasks, onTaskSelect }: CalendarViewProps) {
  const events: Event[] = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      title: task.title,
      start: new Date(task.startDate || task.dueDate!),
      end: new Date(task.dueDate!),
      resource: task,
    }));
  return (
    <div className="h-[calc(100vh-220px)]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={(event) => onTaskSelect((event.resource as Task).id)}
      />
    </div>
  );
}
