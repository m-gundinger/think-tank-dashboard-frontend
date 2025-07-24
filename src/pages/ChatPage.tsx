import { ChatInterface } from "@/features/chat";

export function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
        <p className="text-muted-foreground">
          Real-time communication with your team.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
