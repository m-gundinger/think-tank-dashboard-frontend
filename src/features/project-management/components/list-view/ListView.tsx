import { useMemo } from "react";
import { Task } from "@/types";
import { TaskStatus } from "@/types/api";
import { ListViewHeader } from "./ListViewHeader";
import { TaskGroup } from "./TaskGroup";

interface ListViewProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  emptyState: React.ReactNode;
  showWorkspaceColumn?: boolean;
  showProjectColumn?: boolean;
  showTaskTypeColumn?: boolean;
  selectedTaskIds: string[];
  setSelectedTaskIds: (ids: string[]) => void;
}

const statusOrder: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
  TaskStatus.BLOCKED,
  TaskStatus.CANCELLED,
];

const getStatusGroupName = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.TODO:
      return "To Do";
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.IN_REVIEW:
      return "In Review";
    case TaskStatus.DONE:
      return "Done";
    case TaskStatus.BLOCKED:
      return "Blocked";
    case TaskStatus.CANCELLED:
      return "Cancelled";
    default:
      return "Other";
  }
};

export function ListView({
  tasks,
  onTaskSelect,
  onTaskUpdate,
  emptyState,
  showWorkspaceColumn = false,
  showProjectColumn = false,
  showTaskTypeColumn = false,
  selectedTaskIds,
  setSelectedTaskIds,
}: ListViewProps) {
  const groupedTasks = useMemo(() => {
    const groupMap = new Map<string, Task[]>();
    const topLevelTasks = tasks.filter((task) => !task.parentId);

    topLevelTasks.forEach((task) => {
      const groupName = getStatusGroupName(task.status);
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, []);
      }
      groupMap.get(groupName)!.push(task);
    });

    const orderedGroups: [string, Task[]][] = [];
    for (const status of statusOrder) {
      const groupName = getStatusGroupName(status);
      if (groupMap.has(groupName)) {
        orderedGroups.push([groupName, groupMap.get(groupName)!]);
      }
    }

    return orderedGroups;
  }, [tasks]);

  if (tasks.length === 0) {
    return emptyState;
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <ListViewHeader
        showWorkspace={showWorkspaceColumn}
        showProject={showProjectColumn}
        showTaskType={showTaskTypeColumn}
        tasks={tasks}
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
            showWorkspace={showWorkspaceColumn}
            showProject={showProjectColumn}
            showTaskType={showTaskTypeColumn}
            selectedTaskIds={selectedTaskIds}
            setSelectedTaskIds={setSelectedTaskIds}
          />
        ))}
      </div>
    </div>
  );
}
