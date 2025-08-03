import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "@/components/form/FormFields";
import { useManageDeals } from "../api/useManageDeals";
import { useManageDealStages } from "../api/useManageDealStages";
import { useManageOrganizations } from "../api/useManageOrganizations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { requiredStringSchema } from "@/lib/schemas";

const dealSchema = z.object({
  name: requiredStringSchema("Deal name"),
  value: z.string().optional(),
  stageId: z.string().uuid("A deal stage must be selected."),
  organizationId: z.string().uuid("A organization must be selected."),
});

type DealFormValues = z.infer<typeof dealSchema>;

// Type for the API payload after processing
interface ProcessedDealValues {
  name: string;
  value: number;
  stageId: string;
  organizationId: string;
}

interface DealFormProps {
  initialData?: any;
  onSuccess?: () => void;
  workspaceId: string;
  projectId?: string;
}

export function DealForm({ initialData, onSuccess, projectId }: DealFormProps) {
  const { useCreate, useUpdate } = useManageDeals();
  const { data: stagesData, isLoading: isLoadingStages } = useManageDealStages(
    projectId
  ).useGetAll({ enabled: !!projectId });
  const { data: organizationsData, isLoading: isLoadingOrganizations } =
    useManageOrganizations().useGetAll();

  const isEditMode = !!initialData;
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      name: "",
      value: "0",
      stageId: "",
      organizationId: "",
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      // Convert numeric value to string for the form
      const formData = {
        ...initialData,
        value: initialData.value?.toString() || "0",
      };
      methods.reset(formData);
    }
  }, [initialData, methods]);

  async function onSubmit(values: DealFormValues) {
    // Validate and convert the value field
    let numericValue: number;

    if (!values.value || values.value.trim() === "") {
      methods.setError("value", {
        type: "manual",
        message: "Value is required",
      });
      return;
    }

    const parsed = parseFloat(values.value);
    if (isNaN(parsed) || parsed < 0) {
      methods.setError("value", {
        type: "manual",
        message: "Value must be a positive number",
      });
      return;
    }
    numericValue = parsed;

    const processedValues: ProcessedDealValues = {
      name: values.name,
      value: numericValue,
      stageId: values.stageId,
      organizationId: values.organizationId,
    };

    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: processedValues },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(processedValues, {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      });
    }
  }

  const stageOptions =
    stagesData?.data?.map((s: any) => ({ value: s.id, label: s.name })) || [];
  const organizationOptions =
    organizationsData?.data?.map((c: any) => ({
      value: c.id,
      label: c.name,
    })) || [];

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="name"
            label="Deal Name"
            placeholder="e.g., Q3 Enterprise Contract"
          />
          <FormInput
            name="value"
            label="Value ($)"
            type="number"
            placeholder="e.g., 50000"
          />
          <FormSelect
            name="organizationId"
            label="Organization"
            placeholder={
              isLoadingOrganizations ? "Loading..." : "Select a organization"
            }
            options={organizationOptions}
            disabled={isLoadingOrganizations}
          />
          <FormSelect
            name="stageId"
            label="Stage"
            placeholder={
              !projectId
                ? "Select a project first"
                : isLoadingStages
                  ? "Loading..."
                  : "Select a stage"
            }
            options={stageOptions}
            disabled={isLoadingStages || !projectId}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Deal"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
