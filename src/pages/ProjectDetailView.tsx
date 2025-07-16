import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/features/tasks/components/TaskList";
import { KanbanBoard } from "@/features/kanban/components/KanbanBoard";
import { DashboardList } from "@/features/dashboards/components/DashboardList";
import { EpicList } from "@/features/epics/components/EpicList";
import { ActiveUsers } from "@/components/layout/ActiveUsers";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { CreateTaskDialog } from "@/features/tasks/components/CreateTaskDialog";
import { CreateDashboardDialog } from "@/features/dashboards/components/CreateDashboardDialog";
import { CreateEpicDialog } from "@/features/epics/components/CreateEpicDialog";
import { Task } from "@/features/tasks/task.types";
import { View } from "@/types";
import { ProjectActivityLog } from "@/features/activities/components/ProjectActivityLog";

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
  const renderActionDialog = () => {
    const currentView = views.find((v) => v.id === activeTab);
    const viewType = currentView?.type;

    if (viewType === "KANBAN" || viewType === "LIST") {
      return (
        <CreateTaskDialog workspaceId={workspaceId} projectId={projectId} />
      );
    }
    if (activeTab === "dashboards") {
      return (
        <CreateDashboardDialog
          workspaceId={workspaceId}
          projectId={projectId}
        />
      );
    }
    if (activeTab === "epics") {
      return (
        <CreateEpicDialog workspaceId={workspaceId} projectId={projectId} />
      );
    }
    return null;
  };

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
              workspaceId={workspaceId}
              projectId={projectId}
              tasks={tasks}
              onTaskSelect={onTaskSelect}
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
