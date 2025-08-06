import {
  Calendar,
  dateFnsLocalizer,
  Event,
  Views,
  ToolbarProps,
  View,
} from "react-big-calendar";
import withDragAndDrop, {
  withDragAndDropProps,
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { Task } from "@/types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useCallback } from "react";

interface CalendarEvent extends Event {
  resource: Task;
}

interface CalendarViewProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
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

const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar);

const CustomToolbar = (
  toolbar: ToolbarProps<CalendarEvent>,
  onViewChange: (view: View) => void,
  onNavigateChange: (action: "PREV" | "NEXT" | "TODAY") => void
) => {
  const goToBack = () => {
    onNavigateChange("PREV");
  };

  const goToNext = () => {
    onNavigateChange("NEXT");
  };

  const goToCurrent = () => {
    onNavigateChange("TODAY");
  };

  const viewNames: View[] = ["month", "week", "day", "agenda"];

  return (
    <div className="rbc-toolbar mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={goToBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToCurrent}>
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={goToNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <span className="rbc-toolbar-label font-semibold">{toolbar.label}</span>
      <div className="w-[120px]">
        <Select
          value={toolbar.view}
          onValueChange={(view) => onViewChange(view as View)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {viewNames.map((name) => (
              <SelectItem key={name} value={name} className="capitalize">
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export function CalendarView({
  tasks,
  onTaskSelect,
  onTaskUpdate,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);

  const events: CalendarEvent[] = tasks
    .filter((task) => task.dueDate || task.startDate)
    .map((task) => ({
      title: task.title,
      start: new Date(task.startDate || task.dueDate!),
      end: new Date(task.dueDate || task.startDate!),
      resource: task,
      allDay: !task.startDate || !task.dueDate,
    }));

  const onEventDrop: withDragAndDropProps<CalendarEvent>["onEventDrop"] =
    useCallback(
      (data: EventInteractionArgs<CalendarEvent>) => {
        const { start, end, event } = data;
        const task = event.resource;
        onTaskUpdate(task.id, {
          startDate: (start as Date).toISOString(),
          dueDate: (end as Date).toISOString(),
        });
      },
      [onTaskUpdate]
    );

  const onEventResize: withDragAndDropProps<CalendarEvent>["onEventResize"] =
    useCallback(
      (data: EventInteractionArgs<CalendarEvent>) => {
        const { start, end, event } = data;
        const task = event.resource;
        onTaskUpdate(task.id, {
          startDate: (start as Date).toISOString(),
          dueDate: (end as Date).toISOString(),
        });
      },
      [onTaskUpdate]
    );

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    const status = event.resource.status;
    let className = `rbc-event-status-${status.toLowerCase()}`;
    return { className };
  }, []);

  const handleNavigate = useCallback(
    (newDate: Date) => setCurrentDate(newDate),
    []
  );
  const handleView = useCallback(
    (newView: View) => setCurrentView(newView),
    []
  );

  return (
    <div className="h-[calc(100vh-250px)]">
      <style>{`
        .rbc-event-status-done { background-color: #28a745; opacity: 0.7; }
        .rbc-event-status-in_progress { background-color: #17a2b8; }
        .rbc-event-status-blocked { background-color: #dc3545; }
        .rbc-event-status-in_review { background-color: #ffc107; color: #212529; }
        .rbc-event-status-cancelled { background-color: #6c757d; text-decoration: line-through; }
        .rbc-event-status-todo { background-color: #007bff; }
        .rbc-calendar { font-family: inherit; }
      `}</style>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event: CalendarEvent) => event.start!}
        endAccessor={(event: CalendarEvent) => event.end!}
        style={{ height: "100%" }}
        onSelectEvent={(event: CalendarEvent) =>
          onTaskSelect(event.resource.id)
        }
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        date={currentDate}
        view={currentView}
        onNavigate={handleNavigate}
        onView={handleView}
        eventPropGetter={eventPropGetter}
        components={{
          toolbar: (props: ToolbarProps<CalendarEvent>) =>
            CustomToolbar(
              props,
              (view) => setCurrentView(view),
              (action) => {
                const newDate = new Date(props.date);
                if (action === "PREV") {
                  if (props.view === "month")
                    newDate.setMonth(newDate.getMonth() - 1);
                  if (props.view === "week")
                    newDate.setDate(newDate.getDate() - 7);
                  if (props.view === "day")
                    newDate.setDate(newDate.getDate() - 1);
                } else if (action === "NEXT") {
                  if (props.view === "month")
                    newDate.setMonth(newDate.getMonth() + 1);
                  if (props.view === "week")
                    newDate.setDate(newDate.getDate() + 7);
                  if (props.view === "day")
                    newDate.setDate(newDate.getDate() + 1);
                } else {
                  setCurrentDate(new Date());
                  return;
                }
                setCurrentDate(newDate);
              }
            ),
        }}
      />
    </div>
  );
}
