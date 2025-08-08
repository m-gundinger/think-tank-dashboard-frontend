import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types";

interface ListViewHeaderProps {
  showWorkspace: boolean;
  showProject: boolean;
  showTaskType: boolean;
  tasks: Task[];
  selectedTaskIds: string[];
  setSelectedTaskIds: (ids: string[]) => void;
}

export function ListViewHeader({
  showWorkspace,
  showProject,
  showTaskType,
  tasks,
  selectedTaskIds,
  setSelectedTaskIds,
}: ListViewHeaderProps) {
  const columnClasses = {
    name: "sm:col-span-4",
    workspace: "hidden sm:block sm:col-span-1",
    project: "hidden sm:block sm:col-span-1",
    type: "hidden sm:block sm:col-span-1",
    assignee: "hidden sm:block sm:col-span-1",
    dueDate: "hidden sm:block sm:col-span-1",
    priority: "hidden sm:block sm:col-span-1",
    status: "hidden sm:block sm:col-span-1",
    actions: "hidden sm:block sm:col-span-1",
  };

  let nameSpan = 4;
  if (!showWorkspace) nameSpan++;
  if (!showProject) nameSpan++;
  if (!showTaskType) nameSpan++;

  const allTaskIds = tasks.map((t) => t.id);
  const isAllSelected =
    allTaskIds.length > 0 && selectedTaskIds.length === allTaskIds.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(allTaskIds);
    } else {
      setSelectedTaskIds([]);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 border-b border-border bg-surface px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <div
        className={`col-span-12 sm:col-span-${nameSpan} flex items-center gap-3`}
      >
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
          aria-label="Select all tasks"
          className="border-border bg-element"
        />
        Task Name
      </div>
      {showWorkspace && (
        <div className={columnClasses.workspace}>Workspace</div>
      )}
      {showProject && <div className={columnClasses.project}>Project</div>}
      {showTaskType && <div className={columnClasses.type}>Type</div>}
      <div className={columnClasses.assignee}>Assignee</div>
      <div className={columnClasses.dueDate}>Due Date</div>
      <div className={columnClasses.priority}>Priority</div>
      <div className={columnClasses.status}>Status</div>
      <div className={columnClasses.actions}></div>
    </div>
  );
}
