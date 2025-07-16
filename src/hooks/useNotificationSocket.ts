import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useNotificationSocket() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (event: any) => {
      console.log("New notification received:", event.payload);

      toast(event.payload.message, {
        description: `Severity: ${event.payload.severity}`,
      });

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("NEW_NOTIFICATION", handleNewNotification);

    return () => {
      socket.off("NEW_NOTIFICATION", handleNewNotification);
    };
  }, [socket, queryClient]);
}
