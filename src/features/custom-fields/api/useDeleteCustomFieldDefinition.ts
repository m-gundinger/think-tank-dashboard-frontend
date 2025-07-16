import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface DeleteParams {
  workspaceId: string;
  projectId: string;
  customFieldId: string;
}

async function deleteCustomFieldDefinition({
  workspaceId,
  projectId,
  customFieldId,
}: DeleteParams): Promise<void> {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/custom-fields/${customFieldId}`
  );
}

export function useDeleteCustomFieldDefinition(
  workspaceId: string,
  projectId: string
) {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (customFieldId) =>
      deleteCustomFieldDefinition({ workspaceId, projectId, customFieldId }),
    onSuccess: () => {
      toast.success("Custom field deleted.");
      queryClient.invalidateQueries({
        queryKey: ["customFieldDefinitions", projectId],
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete custom field", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
