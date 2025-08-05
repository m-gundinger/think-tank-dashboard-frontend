import { useState } from "react";
import { useManageGoals } from "../api/useManageGoals";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GoalCard } from "./GoalCard";
import { GoalForm } from "./GoalForm";
import { Goal } from "@/types";

interface GoalListProps {
  workspaceId: string;
  projectId: string;
}

const ListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {Array.from({ length: 2 }).map((_, i) => (
      <Skeleton key={i} className="h-48 w-full" />
    ))}
  </div>
);
export function GoalList({ workspaceId, projectId }: GoalListProps) {
  const { useGetAll } = useManageGoals(workspaceId, projectId);
  const { data, isLoading, isError } = useGetAll();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  if (isLoading) return <ListSkeleton />;
  if (isError) return <div>Error loading goals.</div>;

  const goals = data?.data || [];
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Goals & OKRs</h2>
            <p className="text-muted-foreground">
              Track your project's high-level objectives and key results.
            </p>
          </div>
          <ResourceCrudDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            trigger={
              <Button onClick={() => setIsCreateOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Goal
              </Button>
            }
            title="Create a New Goal"
            description="Define a new objective for your project."
            form={GoalForm}
            formProps={{ workspaceId, projectId }}
            resourcePath={`workspaces/${workspaceId}/projects/${projectId}/goals`}
            resourceKey={["goals", projectId]}
            dialogClassName="sm:max-w-2xl"
          />
        </div>
        {goals.length === 0 ? (
          <EmptyState
            icon={<Target className="text-primary h-10 w-10" />}
            title="No Goals Defined"
            description="Create your first goal to start tracking progress towards your objectives."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {goals.map((goal: Goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                workspaceId={workspaceId}
                projectId={projectId}
                onEdit={() => setEditingGoalId(goal.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ResourceCrudDialog
        isOpen={!!editingGoalId}
        onOpenChange={(isOpen) => !isOpen && setEditingGoalId(null)}
        title="Edit Goal"
        description="Update the details of your goal and its key results."
        form={GoalForm}
        formProps={{ workspaceId, projectId }}
        resourcePath={`workspaces/${workspaceId}/projects/${projectId}/goals`}
        resourceKey={["goals", projectId]}
        resourceId={editingGoalId}
        dialogClassName="sm:max-w-2xl"
      />
    </>
  );
}
