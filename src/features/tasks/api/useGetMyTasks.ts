import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ListTasksQuery } from "../task.types";
async function getMyTasks(query: ListTasksQuery): Promise<any> {
  const { data } = await api.get("/tasks/my-tasks", { params: query });
  return data;
}

export function useGetMyTasks(query: ListTasksQuery) {
  return useQuery({
    queryKey: ["myTasks", query],
    queryFn: () => getMyTasks(query),
  });
}
