import { Control, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkflowActionType } from "@/types/api";
import {
  UpdateTaskStatusFields,
  CreateTaskFields,
  AddCommentActionFields,
  AssignTaskActionFields,
  SendEmailBrevoFields,
  SendTelegramMessageFields,
  SendWebhookFields,
} from "./action-fields";

interface ActionRepeaterProps {
  control: Control<any>;
  index: number;
  remove: (index: number) => void;
}

const actionFieldComponents: Record<string, React.FC<any>> = {
  [WorkflowActionType.UPDATE_TASK_STATUS]: UpdateTaskStatusFields,
  [WorkflowActionType.CREATE_TASK]: CreateTaskFields,
  [WorkflowActionType.ADD_COMMENT]: AddCommentActionFields,
  [WorkflowActionType.ASSIGN_TASK]: AssignTaskActionFields,
  [WorkflowActionType.SEND_EMAIL_BREVO]: SendEmailBrevoFields,
  [WorkflowActionType.SEND_TELEGRAM_MESSAGE]: SendTelegramMessageFields,
  [WorkflowActionType.SEND_WEBHOOK]: SendWebhookFields,
};

export function ActionRepeater({
  control,
  index,
  remove,
}: ActionRepeaterProps) {
  const actionType = useWatch({
    control,
    name: `actions.${index}.type`,
  });

  const SpecificFields = actionFieldComponents[actionType as string];

  return (
    <div className="flex items-start gap-4 rounded-md border bg-slate-50 p-4">
      <div className="flex-grow space-y-4">
        <FormField
          control={control}
          name={`actions.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(WorkflowActionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {SpecificFields && <SpecificFields control={control} index={index} />}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => remove(index)}
        className="mt-8 shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}