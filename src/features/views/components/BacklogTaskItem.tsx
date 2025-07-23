
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Task } from "@/features/tasks/task.types";

interface BacklogTaskItemProps {
  task: Task;
  onTaskSelect: (taskId: string) => void;
}

export function BacklogTaskItem({ task, onTaskSelect }: BacklogTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="mb-2 cursor-grab p-3 active:cursor-grabbing"
        onClick={() => onTaskSelect(task.id)}
      >
        <p className="text-sm font-medium">{task.title}</p>
      </Card>
    </div>
  );
}
