// FILE: src/features/tasks/components/RecurrenceSelector.tsx
import { useState, useEffect } from "react";
import { RRule, rrulestr, Options } from "rrule";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Repeat } from "lucide-react";

interface RecurrenceSelectorProps {
  value: string | null;
  onSave: (rruleString: string | null) => void;
}

const frequencies = [
  { value: RRule.DAILY, label: "Daily" },
  { value: RRule.WEEKLY, label: "Weekly" },
  { value: RRule.MONTHLY, label: "Monthly" },
  { value: RRule.YEARLY, label: "Yearly" },
];

const weekdays = [
  { value: RRule.MO, label: "M" },
  { value: RRule.TU, label: "T" },
  { value: RRule.WE, label: "W" },
  { value: RRule.TH, label: "T" },
  { value: RRule.FR, label: "F" },
  { value: RRule.SA, label: "S" },
  { value: RRule.SU, label: "S" },
];

export function RecurrenceSelector({ value, onSave }: RecurrenceSelectorProps) {
  const [options, setOptions] = useState<Partial<Options>>({});
  const [ruleText, setRuleText] = useState("Does not repeat");
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (value) {
      try {
        const rule = rrulestr(value);
        setOptions(rule.options);
        setRuleText(rule.toText());
      } catch (e) {
        console.error("Error parsing RRULE string:", e);
        setRuleText("Invalid rule");
      }
    } else {
      setOptions({});
      setRuleText("Does not repeat");
    }
  }, [value]);

  const handleSave = () => {
    if (Object.keys(options).length === 0 || options.freq === undefined) {
      onSave(null);
    } else {
      const rule = new RRule({ dtstart: new Date(), ...options });
      onSave(rule.toString());
    }
    setPopoverOpen(false);
  };

  const handleClear = () => {
    setOptions({});
    onSave(null);
    setPopoverOpen(false);
  };

  const freq = options.freq ?? RRule.DAILY;

  const byweekdayValue = options.byweekday
    ? (Array.isArray(options.byweekday)
        ? options.byweekday
        : [options.byweekday]
      ).map((day) => day.toString())
    : [];

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start font-normal">
          <Repeat className="mr-2 h-4 w-4" />
          <span className="truncate">{ruleText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Recurrence</h4>
            <p className="text-muted-foreground text-sm">
              Set how often this task should repeat.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="freq">Repeats</Label>
              <Select
                value={freq?.toString()}
                onValueChange={(val) =>
                  setOptions({ ...options, freq: parseInt(val) })
                }
              >
                <SelectTrigger id="freq" className="col-span-2 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((f) => (
                    <SelectItem key={f.value} value={f.value.toString()}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {freq === RRule.WEEKLY && (
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>On</Label>
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  className="col-span-2 justify-start"
                  value={byweekdayValue}
                  onValueChange={(days) =>
                    setOptions({ ...options, byweekday: days.map(Number) })
                  }
                >
                  {weekdays.map((day) => (
                    <ToggleGroupItem
                      key={day.value.weekday}
                      value={String(day.value.weekday)}
                      className="h-8 w-8"
                    >
                      {day.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="interval">Interval</Label>
              <Input
                id="interval"
                type="number"
                defaultValue={options.interval || 1}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    interval: parseInt(e.target.value) || 1,
                  })
                }
                className="col-span-2 h-8"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button size="sm" onClick={handleSave}>
              Set
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
