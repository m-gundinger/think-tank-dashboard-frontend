import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/features/tasks/components/TaskList";
import { KanbanBoard } from "@/features/views/components/KanbanBoard";
import { BacklogView } from "@/features/views/components/BacklogView";
import { GanttChartView } from "@/features/views/components/GanttChartView";
import { CalendarView } from "@/features/views/components/CalendarView";
import { DashboardList } from "@/features/dashboards/components/DashboardList";
import { EpicList } from "@/features/epics/components/EpicList";
import { SprintBoardView } from "@/features/sprints/components/SprintBoardView";
import { ActiveUsers } from "@/components/layout/ActiveUsers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, CheckSquare, PlusCircle } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateTaskForm } from "@/features/tasks/components/CreateTaskForm";
import { CreateDashboardForm } from "@/features/dashboards/components/CreateDashboardForm";
import { CreateEpicForm } from "@/features/epics/components/CreateEpicForm";
import { Task } from "@/features/tasks/task.types";
import { View } from "@/types";
import { ProjectActivityLog } from "@/features/activities/components/ProjectActivityLog";
import { EmptyState } from "@/components/ui/empty-state";
import { useState } from "react";
import { TemplateSelectorDialog } from "@/features/task-templates/components/TemplateSelectorDialog";

interface ProjectDetailViewProps {
  views: View[];
  tasks: Task[];
  workspaceId: string;
  projectId: string;
  onTaskSelect: (taskId: string | null) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ProjectDetailView({
  views,
  tasks,
  workspaceId,
  projectId,
  onTaskSelect,
  activeTab,
  onTabChange,
}: ProjectDetailViewProps) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const renderActionDialog = () => {
    const currentView = views.find((v) => v.id === activeTab);
    const viewType = currentView?.type;

    if (
      viewType === "KANBAN" ||
      viewType === "LIST" ||
      viewType === "BACKLOG" ||
      viewType === "GANTT" ||
      viewType === "CALENDAR"
    ) {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsCreateTaskOpen(true)}>
                New Blank Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTemplateSelectorOpen(true)}>
                New from Template...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ResourceCrudDialog
            isOpen={isCreateTaskOpen}
            onOpenChange={setIsCreateTaskOpen}
            title="Create a new task"
            description="Fill in the details below to add a new task."
            form={CreateTaskForm}
            formProps={{ workspaceId, projectId }}
            resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
            resourceKey={["tasks", projectId]}
          />

          <TemplateSelectorDialog
            workspaceId={workspaceId}
            projectId={projectId}
            isOpen={isTemplateSelectorOpen}
            onOpenChange={setIsTemplateSelectorOpen}
          />
        </>
      );
    }
    if (activeTab === "dashboards") {
      return (
        <ResourceCrudDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          trigger={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Dashboard
            </Button>
          }
          title="Create New Dashboard"
          description="Dashboards contain widgets to visualize your project data."
          form={CreateDashboardForm}
          formProps={{ workspaceId, projectId }}
          resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/dashboards`}
          resourceKey={["dashboards", projectId]}
        />
      );
    }
    if (activeTab === "epics") {
      return (
        <ResourceCrudDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          trigger={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Epic
            </Button>
          }
          title="Create New Epic"
          description="Epics are large bodies of work that can be broken down into a number of smaller tasks."
          form={CreateEpicForm}
          formProps={{ workspaceId, projectId }}
          resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/epics`}
          resourceKey={["epics", projectId]}
        />
      );
    }
    return null;
  };

  const projectTaskEmptyState = (
    <EmptyState
      icon={<CheckSquare className="text-primary h-10 w-10" />}
      title="No tasks yet"
      description="Create the first task in this project to get started."
      action={renderActionDialog()}
    />
  );
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
          {views.map((view) => (
            <TabsTrigger key={view.id} value={view.id}>
              {view.name}
            </TabsTrigger>
          ))}
          <TabsTrigger value="sprints">Sprints</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="epics">Epics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <ActiveUsers />
          {renderActionDialog()}
          <Button variant="outline" asChild>
            <Link to="settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {views.map((view) => (
        <TabsContent key={view.id} value={view.id} className="mt-0 h-full">
          {view.type === "LIST" && (
            <TaskList
              apiUrl={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
              queryKey={["tasks", projectId]}
              tasks={tasks}
              onTaskSelect={onTaskSelect}
              emptyState={projectTaskEmptyState}
            />
          )}
          {view.type === "KANBAN" && (
            <KanbanBoard
              views={views}
              tasks={tasks}
              workspaceId={workspaceId}
              projectId={projectId}
              onTaskSelect={onTaskSelect}
            />
          )}
          {view.type === "BACKLOG" && (
            <BacklogView
              tasks={tasks}
              workspaceId={workspaceId}
              projectId={projectId}
              onTaskSelect={onTaskSelect}
            />
          )}
          {view.type === "GANTT" && <GanttChartView tasks={tasks} />}
          {view.type === "CALENDAR" && (
            <CalendarView tasks={tasks} onTaskSelect={onTaskSelect} />
          )}
        </TabsContent>
      ))}

      <TabsContent value="sprints" className="mt-0">
        <SprintBoardView
          workspaceId={workspaceId}
          projectId={projectId}
          views={views}
          tasks={tasks}
          onTaskSelect={onTaskSelect}
        />
      </TabsContent>

      <TabsContent value="dashboards" className="mt-0 space-y-4">
        <DashboardList workspaceId={workspaceId} projectId={projectId} />
      </TabsContent>

      <TabsContent value="epics" className="mt-0">
        <EpicList workspaceId={workspaceId} projectId={projectId} />
      </TabsContent>

      <TabsContent value="activity" className="mt-0">
        <ProjectActivityLog workspaceId={workspaceId} projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
}