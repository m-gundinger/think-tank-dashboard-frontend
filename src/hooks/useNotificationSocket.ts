import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useNotificationSocket() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewNotification = (event: { payload: any }) => {
      const newNotification = event.payload;

      toast.info(newNotification.message, {
        description: `Severity: ${newNotification.severity}`,
      });

      queryClient.setQueryData<any>(
        ["notifications"],
        (oldData: { data: any; total: number; unreadCount: any }) => {
          if (!oldData) {
            const newData = {
              data: [newNotification],
              total: 1,
              unreadCount: 1,
              page: 1,
              limit: 10,
              totalPages: 1,
            };
            return newData;
          }

          const newData = {
            ...oldData,
            data: [newNotification, ...(oldData.data || [])],
            total: oldData.total + 1,
            unreadCount: (oldData.unreadCount ?? 0) + 1,
          };
          return newData;
        }
      );
    };

    socket.on("NEW_NOTIFICATION", handleNewNotification);

    return () => {
      socket.off("NEW_NOTIFICATION", handleNewNotification);
    };
  }, [socket, queryClient]);
}