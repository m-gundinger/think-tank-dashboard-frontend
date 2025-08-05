import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "../api/useManageChat";
import { Paperclip, Send } from "lucide-react";

interface MessageInputProps {
  threadId: string | null;
}

export function MessageInput({ threadId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const sendMessageMutation = useSendMessage(threadId!);

  const handleSend = () => {
    if (content.trim() && threadId) {
      sendMessageMutation.mutate(content, {
        onSuccess: () => setContent(""),
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!threadId) {
    return null;
  }

  return (
    <div className="border-t p-4">
      <div className="relative">
        <Textarea
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyPress}
          className="pr-20"
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSend}
            size="icon"
            disabled={sendMessageMutation.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
