import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, PlusCircle, Settings, Columns } from "lucide-react";
import { Link } from "react-router-dom";
import { Project, View } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortMenu } from "@/features/project-management/components/list-view/SortMenu";
import { OnChangeFn, SortingState } from "@tanstack/react-table";
import { ColumnVisibilityToggle } from "@/features/project-management/components/list-view/ColumnVisibilityToggle";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TasksPageHeaderProps {
  scope: "user" | "project";
  project?: Project;
  views: View[];
  activeView: View | undefined;
  onViewChange: (viewId: string) => void;
  onNewTaskClick: () => void;
  onNewTaskFromTemplateClick: () => void;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  listColumns: { id: string; label: string; visible: boolean }[];
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  kanbanColumns: { id: string; name: string }[];
  kanbanColumnIds: string[];
  setKanbanColumnIds: (ids: string[] | ((prev: string[]) => string[])) => void;
}

const listSortableColumns = [
  { id: "title", label: "Task Name" },
  { id: "priority", label: "Priority" },
  { id: "dueDate", label: "Due Date" },
  { id: "status", label: "Status" },
  { id: "projectName", label: "Project" },
  { id: "workspaceName", label: "Workspace" },
];

export function TasksPageHeader({
  scope,
  project,
  views,
  activeView,
  onViewChange,
  onNewTaskClick,
  onNewTaskFromTemplateClick,
  sorting,
  setSorting,
  listColumns,
  onColumnVisibilityChange,
  filter,
  onFilterChange,
  kanbanColumns,
  kanbanColumnIds,
  setKanbanColumnIds,
}: TasksPageHeaderProps) {
  return (
    <header>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {scope === "project" ? project?.name : "My Tasks"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {scope === "user" && (
            <>
              <Label htmlFor="task-filter" className="sr-only">
                Filter tasks
              </Label>
              <Select value={filter} onValueChange={onFilterChange}>
                <SelectTrigger
                  id="task-filter"
                  className="border-border bg-element text-foreground hover:bg-hover"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_assigned">
                    All Assigned Tasks
                  </SelectItem>
                  <SelectItem value="assigned_project">
                    Assigned Project Tasks
                  </SelectItem>
                  <SelectItem value="assigned_standalone">
                    Assigned Standalone Tasks
                  </SelectItem>
                  <SelectItem value="created_project">
                    Created Project Tasks
                  </SelectItem>
                  <SelectItem value="created_standalone">
                    Created Standalone Tasks
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          <SortMenu
            sorting={sorting}
            setSorting={setSorting}
            sortableColumns={listSortableColumns}
          />
          {activeView?.type === "LIST" && (
            <ColumnVisibilityToggle
              columns={listColumns}
              onVisibilityChange={onColumnVisibilityChange}
            />
          )}

          {activeView?.type === "KANBAN" && scope === "user" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border bg-element text-foreground hover:bg-hover"
                >
                  <Columns className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {kanbanColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={kanbanColumnIds.includes(column.id)}
                    onCheckedChange={(checked) => {
                      setKanbanColumnIds((prev) =>
                        checked
                          ? [...prev, column.id]
                          : prev.filter((id) => id !== column.id)
                      );
                    }}
                  >
                    {column.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" /> New Task
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onNewTaskClick}>
                New Blank Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onNewTaskFromTemplateClick}>
                New from Template...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className="border-border bg-element text-foreground hover:bg-hover"
            asChild
          >
            <Link
              to={
                scope === "project" && project
                  ? `/workspaces/${project.workspaceId}/projects/${project.id}/settings`
                  : "/settings"
              }
            >
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <Tabs
        value={activeView?.id}
        onValueChange={onViewChange}
        className="mt-4"
      >
        <TabsList>
          {views.map((view) => (
            <TabsTrigger key={view.id} value={view.id}>
              {view.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  );
}
