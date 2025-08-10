import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

interface BulkDatePickerProps {
  onUpdate: (updates: { dueDate: Date | null }) => void;
}

export function BulkDatePicker({ onUpdate }: BulkDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Set Due Date
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          onSelect={(date) => onUpdate({ dueDate: date || null })}
        />
      </PopoverContent>
    </Popover>
  );
}