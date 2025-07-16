import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProjectSocket(projectId: string) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !projectId) {
      return;
    }

    const handleContextUpdate = (event: any) => {
      console.log("CONTEXT_ITEM_UPDATED received:", event);
      const { entityType, data } = event.payload;

      toast.info(`Real-time update: ${entityType} was modified.`);

      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["epics", projectId] });
      queryClient.invalidateQueries({ queryKey: ["views", projectId] });

      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["task", data.id] });
      }
    };

    socket.on("CONTEXT_ITEM_UPDATED", handleContextUpdate);

    socket.emit("join_context", {
      contextType: "Project",
      contextId: projectId,
    });

    return () => {
      socket.emit("leave_context", {
        contextType: "Project",
        contextId: projectId,
      });
      socket.off("CONTEXT_ITEM_UPDATED", handleContextUpdate);
    };
  }, [socket, projectId, queryClient]);
}
