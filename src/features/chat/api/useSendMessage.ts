import { useApiMutation } from "@/hooks/useApiMutation";

interface SendMessageParams {
  threadId: string;
  content: string;
}

async function sendMessage({
  threadId,
  content,
}: SendMessageParams): Promise<any> {
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

    invalidateQueries: [["chatMessages", threadId]],
  });
}
