import {
  useForm,
  FormProvider,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormSelect,
  FormMultiSelectPopover,
} from "@/components/form/FormFields";
import { useManageDeals } from "../api/useManageDeals";
import { useManageDealStages } from "../api/useManageDealStages";
import { useManageOrganizations } from "../api/useManageOrganizations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { requiredStringSchema } from "@/lib/schemas";
import { useGetProjectMembers } from "@/features/project-management/api/useGetProjectMembers";
import { useApiResource } from "@/hooks/useApiResource";

const dealSchema = z.object({
  name: requiredStringSchema("Deal name"),
  value: z.coerce
    .number()
    .positive({ message: "Value must be a positive number." }),
  stageId: z.string().uuid("A deal stage must be selected."),
  organizationId: z.string().uuid("An organization must be selected."),
  ownerId: z.string().uuid("An owner is required.").optional(),
  contactIds: z.array(z.string().uuid()).optional(),
  projectId: z.string().uuid().optional().nullable(),
});

type DealFormValues = z.infer<typeof dealSchema>;

interface DealFormProps {
  initialData?: any;
  onSuccess?: () => void;
  workspaceId: string;
  projectId?: string;
}

export function DealForm({
  initialData,
  onSuccess,
  workspaceId,
  projectId,
}: DealFormProps) {
  const { useCreate, useUpdate } = useManageDeals();
  const { data: stagesData, isLoading: isLoadingStages } = useManageDealStages(
    projectId
  ).useGetAll({ enabled: !!projectId });
  const { data: organizationsData, isLoading: isLoadingOrganizations } =
    useManageOrganizations().useGetAll();
  const { data: membersData, isLoading: isLoadingMembers } =
    useGetProjectMembers(workspaceId, projectId!, { enabled: !!projectId });
  const { data: peopleData, isLoading: isLoadingPeople } = useApiResource(
    "people",
    ["people"]
  ).useGetAll();

  const isEditMode = !!initialData;
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema) as unknown as Resolver<
      DealFormValues,
      any
    >,
    defaultValues: {
      name: "",
      value: 0,
      stageId: "",
      organizationId: "",
      contactIds: [],
      projectId: projectId ?? null,
    },
  });

  useEffect(() => {
    if (initialData) {
      const formData: Partial<DealFormValues> = {
        ...initialData,
        value: initialData.value || 0,
        contactIds: initialData.contacts?.map((c: any) => c.id) || [],
        projectId:
          initialData.projectId !== undefined
            ? initialData.projectId
            : (projectId ?? null),
      };
      methods.reset(formData as DealFormValues);
    }
  }, [initialData, methods, projectId]);

  const onSubmit: SubmitHandler<DealFormValues> = async (values) => {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(
        { ...values, projectId },
        {
          onSuccess: () => {
            methods.reset();
            onSuccess?.();
          },
        }
      );
    }
  };

  const stageOptions =
    stagesData?.data?.map((s: any) => ({ value: s.id, label: s.name })) || [];
  const organizationOptions =
    organizationsData?.data?.map((o: any) => ({
      value: o.id,
      label: o.name,
    })) || [];
  const ownerOptions =
    membersData?.map((m: any) => ({ value: m.userId, label: m.name })) || [];
  const contactOptions =
    peopleData?.data.map((p: any) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
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
              isLoadingOrganizations ? "Loading..." : "Select an organization"
            }
            options={organizationOptions}
            disabled={isLoadingOrganizations || isEditMode}
          />
          <FormSelect
            name="stageId"
            label="Stage"
            placeholder={
              !projectId
                ? "Deal stages depend on a project context"
                : isLoadingStages
                  ? "Loading..."
                  : "Select a stage"
            }
            options={stageOptions}
            disabled={isLoadingStages || !projectId}
          />
          <FormSelect
            name="ownerId"
            label="Owner"
            placeholder={
              !projectId
                ? "Owners depend on a project context"
                : isLoadingMembers
                  ? "Loading..."
                  : "Select an owner"
            }
            options={ownerOptions}
            disabled={isLoadingMembers || !projectId}
          />
          <FormMultiSelectPopover
            name="contactIds"
            label="Contacts"
            placeholder={isLoadingPeople ? "Loading..." : "Select contacts"}
            options={contactOptions}
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
