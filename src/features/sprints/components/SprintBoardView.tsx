import { useState, useMemo } from "react";
import { useManageSprints } from "../api/useManageSprints";
import { KanbanBoard } from "@/features/views/components/KanbanBoard";
import { SprintList } from "./SprintList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateSprintForm } from "./CreateSprintForm";
import { EmptyState } from "@/components/ui/empty-state";
import { SprintStatus } from "@/types";
import { View } from "@/types";
import { Task } from "@/features/tasks/task.types";
import { VelocityChart } from "@/features/reporting/components/VelocityChart";

interface SprintBoardViewProps {
  workspaceId: string;
  projectId: string;
  views: View[];
  tasks: Task[];
  onTaskSelect: (taskId: string | null) => void;
}

export function SprintBoardView({
  workspaceId,
  projectId,
  views,
  tasks,
  onTaskSelect,
}: SprintBoardViewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const sprintResource = useManageSprints(workspaceId, projectId);
  const { data: sprintsData, isLoading } = sprintResource.useGetAll();
  const updateMutation = sprintResource.useUpdate();

  const activeSprint = useMemo(
    () => sprintsData?.data?.find((s: any) => s.status === SprintStatus.ACTIVE),
    [sprintsData]
  );

  const completedSprints = useMemo(
    () =>
      sprintsData?.data?.filter(
        (s: any) => s.status === SprintStatus.COMPLETED
      ) || [],
    [sprintsData]
  );

  const activeSprintTasks = useMemo(
    () => tasks.filter((task) => task.sprintId === activeSprint?.id),
    [tasks, activeSprint]
  );

  const handleStartSprint = (sprintId: string) => {
    if (activeSprint) {
      alert(
        "An active sprint is already in progress. Please complete it first."
      );
      return;
    }
    updateMutation.mutate({
      id: sprintId,
      data: { status: SprintStatus.ACTIVE },
    });
  };

  const handleCompleteSprint = (sprintId: string) => {
    updateMutation.mutate({
      id: sprintId,
      data: { status: SprintStatus.COMPLETED },
    });
  };

  if (isLoading) {
    return <div>Loading sprints...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sprints</h2>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Sprint
            </Button>
          }
          title="Create a New Sprint"
          description="Organize your work into time-boxed sprints."
          form={CreateSprintForm}
          formProps={{ workspaceId, projectId }}
          resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/sprints`}
          resourceKey={["sprints", projectId]}
        />
      </div>

      <VelocityChart sprints={completedSprints} />

      {activeSprint ? (
        <div className="rounded-lg border p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{activeSprint.name}</h3>
              <p className="text-muted-foreground">{activeSprint.goal}</p>
            </div>
            <Button onClick={() => handleCompleteSprint(activeSprint.id)}>
              Complete Sprint
            </Button>
          </div>
          <div className="h-[60vh]">
            <KanbanBoard
              workspaceId={workspaceId}
              projectId={projectId}
              views={views}
              tasks={activeSprintTasks}
              onTaskSelect={onTaskSelect}
            />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<PlusCircle className="h-10 w-10" />}
          title="No Active Sprint"
          description="Start a planned sprint or create a new one to begin."
        />
      )}

      <SprintList
        sprints={sprintsData?.data || []}
        onStartSprint={handleStartSprint}
      />
    </div>
  );
}
