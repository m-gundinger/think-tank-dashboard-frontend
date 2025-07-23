import { FormSelect } from "@/components/form/FormFields";
import { useManageGoals } from "@/features/goals/api/useManageGoals";
import { useParams } from "react-router-dom";

export function GoalTrackingConfigFields() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const { data: goalsData, isLoading } = useManageGoals(
    workspaceId!,
    projectId!
  ).useGetAll();

  const goalOptions =
    goalsData?.data?.map((goal: any) => ({
      value: goal.id,
      label: goal.name,
    })) || [];

  return (
    <div className="space-y-4">
      <FormSelect
        name="config.goalId"
        label="Goal to Track"
        placeholder={isLoading ? "Loading goals..." : "Select a goal"}
        options={goalOptions}
        disabled={isLoading}
      />
    </div>
  );
}
