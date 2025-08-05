import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function updateDealStageOrder(
  updates: {
    id: string;
    order: number;
  }[]
): Promise<any> {
  // Note: The backend seems to have a bug where this endpoint is not defined.
  // Assuming a PUT to /deal-stages/ with a specific body structure for now.
  // This might need to be adjusted to a different endpoint e.g., PUT deal-stages/order
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