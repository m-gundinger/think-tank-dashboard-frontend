import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManageTaskTypes } from "../api/useManageTaskTypes";
import { TaskType } from "@/types";

interface TaskTypeSelectorProps {
  workspaceId?: string | null;
  projectId?: string | null;
  value: string | null;
  onValueChange: (value: string | null) => void;
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
    workspaceId ?? undefined,
    projectId ?? undefined
  ).useGetAll();

  const selectedType = typesData?.data?.find((t: TaskType) => t.id === value);

  const displayValue = () => {
    if (isLoading && value) return "Loading...";
    if (selectedType) return selectedType.name;
    return "None";
  };

  return (
    <Select
      value={value ?? ""}
      onValueChange={(val) => onValueChange(val === "none" ? null : val)}
      disabled={disabled || isLoading}
    >
      <SelectTrigger
        className="h-auto w-full justify-start border-none bg-transparent p-1 font-normal hover:bg-accent focus:ring-0"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue placeholder="None">{displayValue()}</SelectValue>
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Loading types...
          </SelectItem>
        ) : (
          <>
            <SelectItem value="none">None</SelectItem>
            {typesData?.data?.map((type: TaskType) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
}