import {
  FormInput,
  FormSelect,
  FormMultiSelectPopover,
} from "@/components/form/FormFields";
import { ResourceForm } from "@/components/form/ResourceForm";
import { useManageDealStages } from "../api/useManageDealStages";
import { useManageOrganizations } from "../api/useManageOrganizations";
import { z } from "zod";
import { requiredStringSchema } from "@/lib/schemas";
import { useGetProjectMembers } from "@/features/project-management/api/useGetProjectMembers";
import { useManagePeople } from "../api/useManagePeople";

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
  const { data: stagesData, isLoading: isLoadingStages } = useManageDealStages(
    projectId
  ).useGetAll({ enabled: !!projectId });
  const { data: organizationsData, isLoading: isLoadingOrganizations } =
    useManageOrganizations().useGetAll();
  const { data: membersData, isLoading: isLoadingMembers } =
    useGetProjectMembers(workspaceId, projectId!, { enabled: !!projectId });
  const { data: peopleData, isLoading: isLoadingPeople } =
    useManagePeople().useGetAll();

  const processedInitialData = initialData
    ? {
        ...initialData,
        value: initialData.value || 0,
        contactIds: initialData.contacts?.map((c: any) => c.id) || [],
        projectId:
          initialData.projectId !== undefined
            ? initialData.projectId
            : (projectId ?? null),
      }
    : {
        projectId: projectId ?? null,
        contactIds: [],
        value: 0,
      };

  return (
    <ResourceForm
      schema={dealSchema}
      resourcePath="deals"
      resourceKey={["deals"]}
      initialData={processedInitialData}
      onSuccess={onSuccess}
      processValues={(values) => ({ ...values, projectId })}
      renderFields={() => (
        <>
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
            options={
              organizationsData?.data?.map((o: any) => ({
                value: o.id,
                label: o.name,
              })) || []
            }
            disabled={isLoadingOrganizations || !!initialData}
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
            options={
              stagesData?.data?.map((s: any) => ({
                value: s.id,
                label: s.name,
              })) || []
            }
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
            options={
              membersData?.map((m: any) => ({
                value: m.userId,
                label: m.name,
              })) || []
            }
            disabled={isLoadingMembers || !projectId}
          />
          <FormMultiSelectPopover
            name="contactIds"
            label="Contacts"
            placeholder={isLoadingPeople ? "Loading..." : "Select contacts"}
            options={
              peopleData?.data.map((p: any) => ({
                id: p.id,
                name: `${p.firstName} ${p.lastName}`,
              })) || []
            }
          />
        </>
      )}
    />
  );
}
