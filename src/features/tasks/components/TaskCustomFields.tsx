import { useGetCustomFieldDefinitions } from "@/features/custom-fields/api/useGetCustomFieldDefinitions";
import { useUpdateTaskCustomValues } from "../api/useUpdateTaskCustomValues";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function TaskCustomFields({ task, workspaceId, projectId }: any) {
  const { data: definitionsData, isLoading } = useGetCustomFieldDefinitions(
    workspaceId,
    projectId
  );
  const { mutate: updateValues } = useUpdateTaskCustomValues(
    workspaceId,
    projectId,
    task.id
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (!definitionsData || definitionsData.data.length === 0) {
    return null;
  }

  const handleUpdate = (fieldId: string, value: any) => {
    updateValues([{ fieldId, value }]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Custom Fields</h3>
      <div className="space-y-4">
        {definitionsData.data.map((def: any) => {
          const currentValue =
            task.customFields.find((cf: any) => cf.fieldId === def.id)?.value ??
            "";

          return (
            <div key={def.id}>
              <Label className="text-muted-foreground text-xs">
                {def.name}
              </Label>
              {def.type === "TEXT" && (
                <Input
                  defaultValue={currentValue}
                  onBlur={(e) => handleUpdate(def.id, e.target.value)}
                />
              )}
              {def.type === "NUMBER" && (
                <Input
                  type="number"
                  defaultValue={currentValue}
                  onBlur={(e) =>
                    handleUpdate(def.id, parseFloat(e.target.value))
                  }
                />
              )}
              {def.type === "DATE" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !currentValue && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentValue ? (
                        format(new Date(currentValue), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        currentValue ? new Date(currentValue) : undefined
                      }
                      onSelect={(date) =>
                        handleUpdate(def.id, date?.toISOString())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
              {def.type === "SELECT" && (
                <Select
                  defaultValue={currentValue}
                  onValueChange={(value) => handleUpdate(def.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${def.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {def.options?.values?.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
