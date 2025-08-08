import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types";

const isOverdue = (dueDateStr: string | null): boolean => {
  if (!dueDateStr) return false;
  const dueDate = new Date(dueDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
};

interface DueDateCellProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function DueDateCell({ task, onUpdate }: DueDateCellProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  const handleDateSelect = (date: Date | undefined) => {
    onUpdate(task.id, { dueDate: date ? date.toISOString() : null });
  };

  return (
    <Popover>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          className={`h-auto p-0 font-normal hover:bg-transparent ${
            isOverdue(task.dueDate) ? "font-semibold text-red-500" : ""
          }`}
        >
          {dueDate ? format(dueDate, "MMM d") : "-"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          mode="single"
          selected={dueDate ?? undefined}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}