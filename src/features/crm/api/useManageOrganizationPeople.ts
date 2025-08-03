import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface AddPersonParams {
  organizationId: string;
  personId: string;
  role?: string;
}

async function addPersonToOrganization({
  organizationId,
  personId,
  role,
}: AddPersonParams) {
  const { data } = await api.post(`/organizations/${organizationId}/people`, {
    personId,
    role,
  });
  return data;
}

interface RemovePersonParams {
  organizationId: string;
  personId: string;
}

async function removePersonFromOrganization({
  organizationId,
  personId,
}: RemovePersonParams) {
  const { data } = await api.delete(
    `/organizations/${organizationId}/people/${personId}`
  );
  return data;
}

export function useManageOrganizationPeople(organizationId: string) {
  const addPersonMutation = useApiMutation<
    any,
    Omit<AddPersonParams, "organizationId">
  >({
    mutationFn: (params) =>
      addPersonToOrganization({ organizationId, ...params }),
    successMessage: "Person added to organization.",
    invalidateQueries: [
      ["organizations"],
      ["organization", organizationId],
      ["people"],
    ],
  });
  const removePersonMutation = useApiMutation<any, string>({
    mutationFn: (personId) =>
      removePersonFromOrganization({ organizationId, personId }),
    successMessage: "Person removed from organization.",
    invalidateQueries: [
      ["organizations"],
      ["organization", organizationId],
      ["people"],
    ],
  });
  return {
    addPerson: addPersonMutation.mutate,
    removePerson: removePersonMutation.mutate,
    isLoading: addPersonMutation.isPending || removePersonMutation.isPending,
  };
}