import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function updateDealStageOrder(
  updates: {
    id: string;
    order: number;
  }[]
): Promise<any> {
  const { data } = await api.put("/deal-stages/order", { stages: updates });
  return data;
}

export function useUpdateDealStageOrder() {
  return useApiMutation({
    mutationFn: updateDealStageOrder,
    successMessage: "Deal stages reordered successfully.",
    invalidateQueries: [["dealStages"]],
  });
}
