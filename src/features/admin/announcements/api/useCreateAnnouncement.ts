import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function createAnnouncement(announcementData: any): Promise<any> {
  const { data } = await api.post("/announcements", announcementData);
  return data;
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
