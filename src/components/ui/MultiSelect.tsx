import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Skill = {
  id: string;
  name: string;
};

interface MultiSelectProps {
  options: Skill[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = e.target as HTMLInputElement;
    if (e.key === "Backspace" || e.key === "Delete") {
      if (input.value === "") {
        e.preventDefault();
        const newSelected = [...selected];
        newSelected.pop();
        onChange(newSelected);
      }
    }

    if (e.key === "Escape") {
      input.blur();
    }
  };

  const selectedSkills = options.filter((option) =>
    selected.includes(option.id)
  );

  return (
    <div className="relative">
      <CommandPrimitive
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group border-input ring-offset-background focus-within:ring-ring rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selectedSkills.map((option) => {
              return (
                <Badge key={option.id} variant="secondary">
                  {option.name}
                  <button
                    className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option.id);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(option.id)}
                  >
                    <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              placeholder={props.placeholder || "Select..."}
              className="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
            />
          </div>
        </div>
        {open && options.length > 0 && (
          <div className="bg-popover text-popover-foreground animate-in absolute top-full z-10 mt-2 w-full rounded-md border shadow-md outline-none">
            <CommandList>
              {options
                .filter((option) => !selected.includes(option.id))
                .map((option) => (
                  <CommandItem
                    key={option.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      onChange([...selected, option.id]);
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.name}
                  </CommandItem>
                ))}
            </CommandList>
          </div>
        )}
      </CommandPrimitive>
    </div>
  );
}
