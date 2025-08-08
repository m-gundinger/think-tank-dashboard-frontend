import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

type View = "month" | "week" | "agenda";

interface CalendarToolbarProps {
  currentDate: Date;
  currentView: View;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onViewChange: (view: View) => void;
}

export function CalendarToolbar({
  currentDate,
  currentView,
  onNavigate,
  onViewChange,
}: CalendarToolbarProps) {
  const getPeriodLabel = () => {
    if (currentView === "month") {
      return format(currentDate, "MMMM yyyy");
    }
    if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${format(startOfWeek, "MMM d")} - ${format(
        endOfWeek,
        "MMM d, yyyy"
      )}`;
    }
    return "Agenda";
  };

  return (
    <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center space-x-2">
        {currentView !== "agenda" && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("PREV")}
              className="hover:bg-hover h-9 w-9 bg-element"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("NEXT")}
              className="hover:bg-hover h-9 w-9 bg-element"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        <h2 className="ml-4 text-xl font-semibold text-foreground">
          {getPeriodLabel()}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => onNavigate("TODAY")}
          variant="outline"
          className="hover:bg-hover bg-element"
        >
          Today
        </Button>
        <div className="flex items-center rounded-lg bg-element p-1 text-sm">
          {(["month", "week", "agenda"] as View[]).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`view-btn rounded-md px-3 py-1 capitalize ${
                currentView === view ? "bg-hover font-semibold" : ""
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
