import { EntityCard } from "@/components/shared/EntityCard";
import { Progress } from "@/components/ui/progress";
import { useManageGoals } from "../api/useManageGoals";
import { Badge } from "@/components/ui/badge";
import { KeyResultType } from "@/types/api";
import { Target } from "lucide-react";
import { Goal, KeyResult } from "@/types";
import { ActionMenu } from "@/components/shared/ActionMenu";

interface GoalCardProps {
  goal: Goal;
  onEdit: () => void;
  workspaceId: string;
  projectId: string;
}

const getOverallProgress = (keyResults: KeyResult[] = []) => {
  if (keyResults.length === 0) return 0;
  const totalProgress = keyResults.reduce((sum, kr) => {
    const range = kr.targetValue - kr.startValue;
    if (range === 0) return sum + (kr.currentValue >= kr.targetValue ? 100 : 0);
    const progress = ((kr.currentValue - kr.startValue) / range) * 100;
    return sum + Math.max(0, Math.min(100, progress));
  }, 0);
  return totalProgress / keyResults.length;
};

const formatKeyResultValue = (value: number, type: KeyResultType) => {
  switch (type) {
    case KeyResultType.PERCENTAGE:
      return `${value}%`;
    case KeyResultType.CURRENCY:
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    case KeyResultType.BOOLEAN:
      return value > 0 ? "Done" : "Not Done";
    default:
      return value.toLocaleString();
  }
};

export function GoalCard({
  goal,
  onEdit,
  workspaceId,
  projectId,
}: GoalCardProps) {
  const { useDelete } = useManageGoals(workspaceId, projectId);
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(`Are you sure you want to delete the goal "${goal.name}"?`)
    ) {
      deleteMutation.mutate(goal.id);
    }
  };

  const overallProgress = getOverallProgress(goal.keyResults);

  return (
    <EntityCard
      title={goal.name}
      description={goal.description || "No description provided."}
      icon={Target}
      actions={
        <ActionMenu
          onEdit={onEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Progress value={overallProgress} className="h-2" />
          <span className="text-sm font-semibold">
            {overallProgress.toFixed(0)}%
          </span>
        </div>
        <div className="space-y-2">
          {goal.keyResults.map((kr: KeyResult) => (
            <div key={kr.id} className="text-sm">
              <p className="font-medium">{kr.name}</p>
              <p className="text-muted-foreground">
                Progress: {formatKeyResultValue(kr.currentValue, kr.type)} /{" "}
                {formatKeyResultValue(kr.targetValue, kr.type)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Badge variant="outline">{goal.status.replace("_", " ")}</Badge>
        </div>
      </div>
    </EntityCard>
  );
}
