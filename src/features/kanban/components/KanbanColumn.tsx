import { SortableContext } from "@dnd-kit/sortable";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";

export function KanbanColumn({ column, tasks, onTaskSelect }: any) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "Column", column },
  });
  const tasksIds = useMemo(() => {
    return tasks.map((task: any) => task.id);
  }, [tasks]);
  return (
    <div
      ref={setNodeRef}
      className="flex w-72 shrink-0 flex-col rounded-lg bg-gray-100/60 p-2"
    >
      <h3 className="p-2 font-semibold text-gray-700">{column.name}</h3>
      <div className="flex-grow space-y-2">
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
