import { useState } from "react";
import { ChannelList } from "./ChannelList";
import { MessageView } from "./MessageView";
import { MessageInput } from "./MessageInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { Label } from "@/components/ui/label";

export function ChatInterface() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const { data: workspacesData } = useGetWorkspaces();

  return (
    <div className="flex h-[calc(100vh-200px)] rounded-lg border">
      <div className="w-1/4 border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Channels & DMs</h2>
          <div className="mt-2 space-y-2">
            <Label>Workspace</Label>
            <Select
              value={selectedWorkspaceId}
              onValueChange={(id) => {
                setSelectedWorkspaceId(id);
                setSelectedThreadId(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspacesData?.data.map((ws) => (
                  <SelectItem key={ws.id} value={ws.id}>
                    {ws.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedWorkspaceId && (
          <ChannelList
            workspaceId={selectedWorkspaceId}
            selectedThreadId={selectedThreadId}
            onSelectThread={setSelectedThreadId}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <MessageView threadId={selectedThreadId} />
        <MessageInput threadId={selectedThreadId} />
      </div>
    </div>
  );
}