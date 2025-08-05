import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ChecklistItem } from "./ChecklistItem";
import { ChecklistItem as ChecklistItemType } from "@/types";

interface TaskChecklistProps {
  initialItems: ChecklistItemType[];
  onSave: (items: ChecklistItemType[]) => void;
}

export function TaskChecklist({ initialItems, onSave }: TaskChecklistProps) {
  const [items, setItems] = useState<ChecklistItemType[]>(initialItems || []);

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  const handleAddItem = () => {
    const newItem: ChecklistItemType = {
      id: uuidv4(),
      text: "",
      completed: false,
    };
    const newItems = [...items, newItem];
    setItems(newItems);
  };

  const handleUpdateItem = (
    id: string,
    updates: Partial<ChecklistItemType>
  ) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setItems(newItems);
    onSave(newItems);
  };

  const handleRemoveItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    onSave(newItems);
  };

  const completedCount = items.filter((item) => item.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Checklist</h3>
        {items.length > 0 && (
          <span className="text-muted-foreground text-xs">
            {completedCount} / {items.length}
          </span>
        )}
      </div>
      {items.length > 0 && <Progress value={progress} className="h-2" />}
      <div className="space-y-2">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onUpdate={handleUpdateItem}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={handleAddItem}>
        <Plus className="mr-2 h-4 w-4" />
        Add item
      </Button>
    </div>
  );
}
