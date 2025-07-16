import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateParams {
  id: string;
  data: any;
}

async function updateAnnouncement({ id, data }: UpdateParams): Promise<any> {
  const response = await api.put(`/announcements/${id}`, data);
  return response.data;
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, UpdateParams>({
    mutationFn: updateAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
