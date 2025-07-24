import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getUserDashboard(): Promise<any> {
  const { data } = await api.get("/user/dashboard");
  return data;
}

export function useGetUserDashboard() {
  return useQuery({
    queryKey: ["userDashboard"],
    queryFn: getUserDashboard,
  });
}
