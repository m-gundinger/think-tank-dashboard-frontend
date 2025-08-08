import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Task, ViewColumn } from "@/types";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: ViewColumn;
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onTaskSelect,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "Column", column },
  });
  const tasksIds = tasks.map((task: any) => task.id);
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-lg bg-surface transition-colors",
        isOver && "drag-over-column"
      )}
    >
      <div className="flex flex-row items-center justify-between gap-2 p-3">
        <h3 className="font-semibold text-foreground">{column.name}</h3>
        <Badge variant="secondary" className="text-xs">
          {tasks.length}
        </Badge>
      </div>
      <div className="mb-2 border-b border-border"></div>
      <div className="flex-grow space-y-2 overflow-y-auto px-2 pb-2">
        <SortableContext items={tasksIds}>
          {tasks.map((task: any) => (
            <KanbanTaskCard
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