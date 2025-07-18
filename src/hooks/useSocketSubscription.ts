import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { useQueryClient } from "@tanstack/react-query";

type EventHandler = (event: any) => void;

export function useSocketSubscription(
  contextType: string,
  contextId: string,
  handlers: Record<string, EventHandler>
) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !contextId || !contextType) {
      return;
    }

    socket.emit("join_context", { contextType, contextId });

    Object.entries(handlers).forEach(([eventName, handler]) => {
      socket.on(eventName, handler);
    });

    return () => {
      socket.emit("leave_context", { contextType, contextId });

      Object.keys(handlers).forEach((eventName) => {
        socket.off(eventName);
      });
    };
  }, [socket, contextType, contextId, queryClient, handlers]);
}
