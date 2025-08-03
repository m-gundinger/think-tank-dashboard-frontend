import { useApiResource } from "@/hooks/useApiResource";
import { DealStage } from "@/types";

type DealStageQuery = {
  projectId?: string;
};

export function useManageDealStages(projectId?: string) {
  const resource = useApiResource<DealStage, DealStageQuery>("deal-stages", [
    "dealStages",
    projectId,
  ]);

  const useGetAll = (options: { enabled?: boolean } = {}) => {
    return resource.useGetAll({ projectId, ...options });
  };

  return { ...resource, useGetAll };
}