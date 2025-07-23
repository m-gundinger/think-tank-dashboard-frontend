
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Task } from "@/features/tasks/task.types";
import { BacklogTaskItem } from "./BacklogTaskItem";

interface EpicDropzoneProps {
  epic: { id: string; name: string };
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}

export function EpicDropzone({ epic, tasks, onTaskSelect }: EpicDropzoneProps) {
  const { setNodeRef } = useDroppable({
    id: `epic-${epic.id}`,
    data: {
      type: "Epic",
      epic,
    },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="rounded-lg bg-gray-100/60 p-4">
      <h3 className="mb-2 font-semibold">{epic.name}</h3>
      <div ref={setNodeRef} className="min-h-[100px] space-y-2">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <BacklogTaskItem
              key={task.id}
              task={task}
              onTaskSelect={onTaskSelect}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="text-muted-foreground flex h-24 items-center justify-center rounded-md border-2 border-dashed text-sm">
            Drag tasks here to add to this epic
          </div>
        )}
      </div>
    </div>
  );
}
