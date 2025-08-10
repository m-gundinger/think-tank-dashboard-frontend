import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function updateDealStageOrder(
  updates: {
    id: string;
    order: number;
  }[]
): Promise<any> {
  const promises = updates.map((update) =>
    api.put(`deal-stages/${update.id}`, { order: update.order })
  );
  const results = await Promise.all(promises);
  return results.map((r) => r.data);
}

export function useUpdateDealStageOrder(projectId: string) {
  return useApiMutation({
    mutationFn: updateDealStageOrder,
    successMessage: "Deal stages reordered successfully.",
    invalidateQueries: [["dealStages", projectId]],
  });
}