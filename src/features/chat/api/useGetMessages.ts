import { useQuery } from "@tanstack/react-query";

async function getMessages(threadId: string): Promise<any[]> {
  // This endpoint doesn't exist yet, so we'll mock the data.
  // const { data } = await api.get(`/chat/threads/${threadId}/messages`);
  // return data;
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
