import { useState } from "react";
import { ChannelList } from "./ChannelList";
import { MessageView } from "./MessageView";
import { MessageInput } from "./MessageInput";

export function ChatInterface() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-200px)] rounded-lg border">
      <div className="w-1/4 border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Channels & DMs</h2>
        </div>
        <ChannelList
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <MessageView threadId={selectedThreadId} />
        <MessageInput threadId={selectedThreadId} />
      </div>
    </div>
  );
}
