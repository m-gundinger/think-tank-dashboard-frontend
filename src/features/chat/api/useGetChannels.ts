import { useQuery } from "@tanstack/react-query";

// This is a mock implementation. Replace with actual API call.
async function getChannels(): Promise<any[]> {
  return Promise.resolve([
    { id: "C1", name: "General", type: "channel" },
    { id: "C2", name: "Project Alpha", type: "channel" },
    { id: "DM1", name: "Alice", type: "dm" },
  ]);
}

export function useGetChannels() {
  return useQuery({
    queryKey: ["chatChannels"],
    queryFn: getChannels,
    staleTime: 1000 * 60 * 5,
  });
}