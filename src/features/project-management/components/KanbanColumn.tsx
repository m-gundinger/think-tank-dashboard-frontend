import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Task, ViewColumn } from "@/types";
import { KanbanTaskCard } from "./KanbanTaskCard";

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
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "Column", column },
  });
  const tasksIds = tasks.map((task: any) => task.id);
  return (
    <div
      ref={setNodeRef}
      className="flex w-72 shrink-0 flex-col rounded-lg bg-gray-100/60 p-2"
    >
      <h3 className="p-2 font-semibold text-gray-700">
        {column.name}
        <span className="ml-2 text-sm font-normal text-gray-500">
          {tasks.length}
        </span>
      </h3>
      <div className="flex-grow space-y-2 overflow-y-auto">
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
