import { useApiResource } from "@/hooks/useApiResource";
import { ListTasksQuery, Task } from "@/types";

export function useGetMyTasks(query: ListTasksQuery) {
  const resource = useApiResource<Task>("standalone-tasks/my-tasks", [
    "myTasks",
  ]);
  return resource.useGetAll(query);
}