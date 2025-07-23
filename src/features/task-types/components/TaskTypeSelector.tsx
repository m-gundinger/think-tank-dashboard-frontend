
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManageTaskTypes } from "../api/useManageTaskTypes";
import { TaskType } from "../task-type.types";

interface TaskTypeSelectorProps {
  workspaceId: string;
  projectId: string;
  value: string | null;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function TaskTypeSelector({
  workspaceId,
  projectId,
  value,
  onValueChange,
  disabled,
}: TaskTypeSelectorProps) {
  const { data: typesData, isLoading } = useManageTaskTypes(
    workspaceId,
    projectId
  ).useGetAll();

  return (
    <Select
      value={value ?? ""}
      onValueChange={onValueChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a type..." />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Loading types...
          </SelectItem>
        ) : (
          typesData?.data?.map((type: TaskType) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
