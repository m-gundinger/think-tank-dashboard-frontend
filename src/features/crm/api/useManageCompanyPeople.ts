import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface AddPersonParams {
  companyId: string;
  personId: string;
  role?: string;
}

async function addPersonToCompany({
  companyId,
  personId,
  role,
}: AddPersonParams) {
  const { data } = await api.post(`/companies/${companyId}/people`, {
    personId,
    role,
  });
  return data;
}

interface RemovePersonParams {
  companyId: string;
  personId: string;
}

async function removePersonFromCompany({
  companyId,
  personId,
}: RemovePersonParams) {
  const { data } = await api.delete(
    `/companies/${companyId}/people/${personId}`
  );
  return data;
}

export function useManageCompanyPeople(companyId: string) {
  const addPersonMutation = useApiMutation<
    any,
    Omit<AddPersonParams, "companyId">
  >({
    mutationFn: (params) => addPersonToCompany({ companyId, ...params }),
    successMessage: "Person added to company.",
    invalidateQueries: [["companies"], ["company", companyId], ["people"]],
  });
  const removePersonMutation = useApiMutation<any, string>({
    mutationFn: (personId) => removePersonFromCompany({ companyId, personId }),
    successMessage: "Person removed from company.",
    invalidateQueries: [["companies"], ["company", companyId], ["people"]],
  });
  return {
    addPerson: addPersonMutation.mutate,
    removePerson: removePersonMutation.mutate,
    isLoading: addPersonMutation.isPending || removePersonMutation.isPending,
  };
}