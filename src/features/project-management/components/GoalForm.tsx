import {
  FormInput,
  FormRichTextEditor,
  FormDatePicker,
  FormSelect,
} from "@/components/form/FormFields";
import { ResourceForm } from "@/components/form/ResourceForm";
import { z } from "zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { GoalStatus, KeyResultType } from "@/types/api";
import { KeyResultInput } from "./KeyResultInput";
import { useGetProjectMembers } from "@/features/project-management/api/useGetProjectMembers";
import { useManageGoals } from "../api/useManageGoals";

const keyResultSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Key Result name is required."),
  type: z.nativeEnum(KeyResultType),
  startValue: z.number(),
  targetValue: z.number(),
  currentValue: z.number(),
});

const goalSchema = z.object({
  name: nameSchema("Goal"),
  description: descriptionSchema,
  status: z.nativeEnum(GoalStatus),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  ownerId: z.string().uuid("An owner is required."),
  keyResults: z.array(keyResultSchema).optional(),
});

interface GoalFormProps {
  workspaceId: string;
  projectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function GoalForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: GoalFormProps) {
  const { data: membersData, isLoading: isLoadingMembers } =
    useGetProjectMembers(workspaceId, projectId);

  const { resourceUrl, resourceKey } = useManageGoals(workspaceId, projectId);

  const statusOptions = Object.values(GoalStatus).map((s) => ({
    value: s,
    label: s.replace(/_/g, " "),
  }));

  const memberOptions =
    membersData?.map((m: any) => ({ value: m.userId, label: m.name })) || [];

  const processedInitialData = initialData
    ? {
        ...initialData,
        startDate: initialData.startDate
          ? new Date(initialData.startDate)
          : null,
        endDate: initialData.endDate ? new Date(initialData.endDate) : null,
      }
    : {
        status: GoalStatus.NOT_STARTED,
        startDate: null,
        endDate: null,
        keyResults: [],
      };

  return (
    <ResourceForm
      schema={goalSchema}
      resourcePath={resourceUrl}
      resourceKey={resourceKey}
      initialData={processedInitialData}
      onSuccess={onSuccess}
      processValues={(values) => ({ ...values, projectId })}
      className="space-y-6"
      renderFields={({ control }) => (
        <>
          <FormInput
            name="name"
            label="Goal Name"
            placeholder="e.g., Achieve Product-Market Fit"
          />
          <FormRichTextEditor name="description" label="Description" />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="status"
              label="Status"
              placeholder="Select status"
              options={statusOptions}
            />
            <FormSelect
              name="ownerId"
              label="Owner"
              placeholder={isLoadingMembers ? "Loading..." : "Select owner"}
              options={memberOptions}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormDatePicker name="startDate" label="Start Date" />
            <FormDatePicker name="endDate" label="End Date" />
          </div>
          <KeyResultInput control={control} />
        </>
      )}
    />
  );
}
