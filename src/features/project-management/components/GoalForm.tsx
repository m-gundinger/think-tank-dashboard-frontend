import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormRichTextEditor,
  FormDatePicker,
  FormSelect,
} from "@/components/form/FormFields";
import { useManageGoals } from "../api/useManageGoals";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { GoalStatus, KeyResultType } from "@/types/api";
import { KeyResultInput } from "./KeyResultInput";
import { useGetProjectMembers } from "@/features/project-management/api/useGetProjectMembers";

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
type GoalFormValues = z.infer<typeof goalSchema>;

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
  const isEditMode = !!initialData;
  const goalResource = useManageGoals(workspaceId, projectId);
  const { data: membersData, isLoading: isLoadingMembers } =
    useGetProjectMembers(workspaceId, projectId);
  const createMutation = goalResource.useCreate();
  const updateMutation = goalResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const methods = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      description: "",
      status: GoalStatus.NOT_STARTED,
      startDate: null,
      endDate: null,
      keyResults: [],
    },
  });
  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset({
        ...initialData,
        startDate: initialData.startDate
          ? new Date(initialData.startDate)
          : null,
        endDate: initialData.endDate ? new Date(initialData.endDate) : null,
      });
    }
  }, [initialData, isEditMode, methods]);
  async function onSubmit(values: GoalFormValues) {
    const payload = {
      ...values,
      projectId,
    };
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: payload },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(payload, {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      });
    }
  }

  const statusOptions = Object.values(GoalStatus).map((s) => ({
    value: s,
    label: s.replace(/_/g, " "),
  }));
  const memberOptions =
    membersData?.map((m: any) => ({ value: m.userId, label: m.name })) || [];
  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
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
          <KeyResultInput control={methods.control} />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Goal"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}