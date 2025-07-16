import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { usePresenceStore } from "@/store/presence";

export function usePresence(contextType: string, contextId: string) {
  const socket = useSocket();
  const { setMembers, addMember, removeMember } = usePresenceStore();

  useEffect(() => {
    if (!socket || !contextId || !contextType) {
      setMembers([]);
      return;
    }

    const roomName = `context:${contextType}:${contextId}`;
    console.log(`Subscribing to presence in room: ${roomName}`);

    socket.emit("join_context", { contextType, contextId }, (response: any) => {
      if (response.success) {
        setMembers(response.data.members);
      }
    });

    const onUserJoined = (event: any) => {
      addMember(event.payload);
    };

    const onUserLeft = (event: any) => {
      removeMember(event.payload.socketId);
    };

    socket.on("USER_JOINED_CONTEXT", onUserJoined);
    socket.on("USER_LEFT_CONTEXT", onUserLeft);

    return () => {
      console.log(`Leaving presence in room: ${roomName}`);
      socket.emit("leave_context", { contextType, contextId });
      socket.off("USER_JOINED_CONTEXT", onUserJoined);
      socket.off("USER_LEFT_CONTEXT", onUserLeft);

      setMembers([]);
    };
  }, [socket, contextType, contextId, setMembers, addMember, removeMember]);
}
