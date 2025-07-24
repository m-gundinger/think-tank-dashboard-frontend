import { useApiMutation } from "@/hooks/useApiMutation";

interface SendMessageParams {
  threadId: string;
  content: string;
}

async function sendMessage({
  threadId,
  content,
}: SendMessageParams): Promise<any> {
  // This endpoint doesn't exist yet.
  // const { data } = await api.post(`/chat/threads/${threadId}/messages`, { content });
  // return data;
  console.log("Sending message:", { threadId, content });
  return Promise.resolve({
    id: "M3",
    author: "You",
    content,
    timestamp: new Date().toISOString(),
  });
}

export function useSendMessage(threadId: string) {
  return useApiMutation({
    mutationFn: (content: string) => sendMessage({ threadId, content }),
    // Optimistic updates would go here in a real implementation
    invalidateQueries: [["chatMessages", threadId]],
  });
}
