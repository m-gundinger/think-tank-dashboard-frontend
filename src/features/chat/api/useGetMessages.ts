import { useQuery } from "@tanstack/react-query";

async function getMessages(threadId: string): Promise<any[]> {
  if (!threadId) return Promise.resolve([]);
  return Promise.resolve([
    {
      id: "M1",
      author: "Alice",
      content: "Hey everyone!",
      timestamp: new Date().toISOString(),
    },
    {
      id: "M2",
      author: "Bob",
      content: "Hi Alice!",
      timestamp: new Date().toISOString(),
    },
  ]);
}

export function useGetMessages(threadId: string | null) {
  return useQuery({
    queryKey: ["chatMessages", threadId],
    queryFn: () => getMessages(threadId!),
    enabled: !!threadId,
  });
}
