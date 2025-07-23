import { GoalStatus, KeyResultType } from "@/types";

export interface KeyResult {
  id: string;
  name: string;
  type: KeyResultType;
  startValue: number;
  targetValue: number;
  currentValue: number;
}

export interface Goal {
  id: string;
  name: string;
  description: string | null;
  status: GoalStatus;
  workspaceId?: string;
  projectId?: string;
  keyResults: KeyResult[];
}
