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
  const { data } = await api.post(`organizations/${organizationId}/people`, {
    personId,
    role,
  });
  return data;
}

interface UpdatePersonParams {
  organizationId: string;
  personId: string;
  role: string;
}

async function updatePersonInOrganization({
  organizationId,
  personId,
  role,
}: UpdatePersonParams) {
  const { data } = await api.patch(
    `organizations/${organizationId}/people/${personId}`,
    {
      role,
    }
  );
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
    `organizations/${organizationId}/people/${personId}`
  );
  return data;
}

export function useManageOrganizationPeople(organizationId: string) {
  const invalidateQueries = [
    ["organizations"],
    ["organization", organizationId],
    ["people"],
  ];

  const addPersonMutation = useApiMutation<
    any,
    Omit<AddPersonParams, "organizationId">
  >({
    mutationFn: (params) =>
      addPersonToOrganization({ organizationId, ...params }),
    successMessage: "Person added to organization.",
    invalidateQueries,
  });

  const updatePersonMutation = useApiMutation<
    any,
    Omit<UpdatePersonParams, "organizationId">
  >({
    mutationFn: (params) =>
      updatePersonInOrganization({ organizationId, ...params }),
    successMessage: "Person's role updated.",
    invalidateQueries,
  });

  const removePersonMutation = useApiMutation<any, string>({
    mutationFn: (personId) =>
      removePersonFromOrganization({ organizationId, personId }),
    successMessage: "Person removed from organization.",
    invalidateQueries,
  });

  return {
    addPerson: addPersonMutation.mutate,
    updatePerson: updatePersonMutation.mutate,
    removePerson: removePersonMutation.mutate,
    isLoading:
      addPersonMutation.isPending ||
      removePersonMutation.isPending ||
      updatePersonMutation.isPending,
  };
}