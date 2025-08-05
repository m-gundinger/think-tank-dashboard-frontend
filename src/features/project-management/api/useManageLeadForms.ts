import { useApiResource } from "@/hooks/useApiResource";
import { LeadForm } from "@/types";

interface LeadFormQuery {
  projectId: string;
}

export function useManageLeadForms(projectId: string) {
  const resource = useApiResource<LeadForm, LeadFormQuery>("lead-form", [
    "leadForms",
    projectId,
  ]);
  return resource;
}
