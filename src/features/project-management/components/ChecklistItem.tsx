import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { ChecklistItem as ChecklistItemType } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onUpdate: (id: string, updates: Partial<ChecklistItemType>) => void;
  onRemove: (id: string) => void;
}

export function ChecklistItem({
  item,
  onUpdate,
  onRemove,
}: ChecklistItemProps) {
  const [text, setText] = useState(item.text);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleBlur = () => {
    if (text.trim() === "") {
      onRemove(item.id);
    } else if (text !== item.text) {
      onUpdate(item.id, { text });
    }
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-2 rounded-md bg-element"
    >
      <span
        className="cursor-grab p-2 text-muted-foreground hover:text-foreground"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="h-5 w-5" />
      </span>
      <Checkbox
        checked={item.completed}
        onCheckedChange={(checked) =>
          onUpdate(item.id, { completed: !!checked })
        }
      />
      <Input
        value={text}
        onChange={handleTextChange}
        onBlur={handleBlur}
        className={`h-8 flex-grow border-none bg-transparent focus:ring-0 ${item.completed ? "text-muted-foreground line-through" : ""}`}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}