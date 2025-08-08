import { Task } from "@/types";
import { format, isToday, isTomorrow } from "date-fns";
import { ListViewHeader } from "../list-view/ListViewHeader";
import { TaskGroup } from "../list-view/TaskGroup";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar } from "lucide-react";

interface AgendaViewProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  selectedTaskIds: string[];
  setSelectedTaskIds: (ids: string[]) => void;
}

const getGroupName = (date: Date): string => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEEE, MMMM d");
};

export function AgendaView({
  tasks,
  onTaskSelect,
  onTaskUpdate,
  selectedTaskIds,
  setSelectedTaskIds,
}: AgendaViewProps) {
  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((task) => {
          if (!task.dueDate) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return new Date(task.dueDate) >= today;
        })
        .sort(
          (a, b) =>
            new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
        ),
    [tasks]
  );

  const groupedTasks = useMemo(() => {
    const groupMap = new Map<string, Task[]>();

    upcomingTasks.forEach((task) => {
      const groupName = getGroupName(new Date(task.dueDate!));
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, []);
      }
      groupMap.get(groupName)!.push(task);
    });
    return Array.from(groupMap.entries());
  }, [upcomingTasks]);

  if (upcomingTasks.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-10 w-10 text-primary" />}
        title="No upcoming tasks"
        description="There are no tasks scheduled for today or in the future."
      />
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <ListViewHeader
        showWorkspace={true}
        showProject={true}
        showTaskType={true}
        tasks={upcomingTasks}
        selectedTaskIds={selectedTaskIds}
        setSelectedTaskIds={setSelectedTaskIds}
      />
      <div id="task-list">
        {groupedTasks.map(([groupName, tasksInGroup]) => (
          <TaskGroup
            key={groupName}
            groupName={groupName}
            tasks={tasksInGroup}
            onTaskSelect={onTaskSelect}
            onTaskUpdate={onTaskUpdate}
            showWorkspace={true}
            showProject={true}
            showTaskType={true}
            selectedTaskIds={selectedTaskIds}
            setSelectedTaskIds={setSelectedTaskIds}
          />
        ))}
      </div>
    </div>
  );
}