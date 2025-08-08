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
    <div className="grid grid-cols-12 items-center gap-4 border-b border-border bg-surface px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <div className="col-span-4 flex items-center gap-3">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
          aria-label="Select all tasks"
          className="border-border bg-element"
        />
        Task Name
      </div>
      {showWorkspace && (
        <div className="col-span-1 hidden truncate sm:block">Workspace</div>
      )}
      {showProject && (
        <div className="col-span-1 hidden truncate sm:block">Project</div>
      )}
      {showTaskType && (
        <div className="col-span-1 hidden truncate sm:block">Type</div>
      )}
      <div className="col-span-1 hidden sm:block">Assignee</div>
      <div className="col-span-1 hidden sm:block">Due Date</div>
      <div className="col-span-1 hidden sm:block">Priority</div>
      <div className="col-span-1 hidden sm:block">Status</div>
      <div className="col-span-1"></div>
    </div>
  );
}
