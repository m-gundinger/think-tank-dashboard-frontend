import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/features/tasks/components/TaskList";
import { KanbanBoard } from "@/features/views/components/KanbanBoard";
import { DashboardList } from "@/features/dashboards/components/DashboardList";
import { EpicList } from "@/features/epics/components/EpicList";
import { ActiveUsers } from "@/components/layout/ActiveUsers";
import { Button } from "@/components/ui/button";
import { Settings, CheckSquare, PlusCircle } from "lucide-react";
import { CreateDashboardForm } from "@/features/dashboards/components/CreateDashboardForm";
import { CreateEpicForm } from "@/features/epics/components/CreateEpicForm";
import { Task } from "@/features/tasks/task.types";
import { View } from "@/types";
import { ProjectActivityLog } from "@/features/activities/components/ProjectActivityLog";
import { EmptyState } from "@/components/ui/empty-state";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateTaskForm } from "@/features/tasks/components/CreateTaskForm";

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const renderActionDialog = () => {
    const currentView = views.find((v) => v.id === activeTab);
    const viewType = currentView?.type;

    if (viewType === "KANBAN" || viewType === "LIST") {
      return (
        <ResourceCrudDialog
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          }
          title="Create a new task"
          description="Fill in the details below to add a new task."
          form={CreateTaskForm}
          formProps={{ workspaceId, projectId }}
          resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
          resourceKey={["tasks", projectId]}
        />
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
      action={
        <ResourceCrudDialog
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          }
          title="Create a new task"
          description="Fill in the details below to add a new task."
          form={CreateTaskForm}
          formProps={{ workspaceId, projectId }}
          resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/tasks`}
          resourceKey={["tasks", projectId]}
        />
      }
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
        </TabsContent>
      ))}

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
