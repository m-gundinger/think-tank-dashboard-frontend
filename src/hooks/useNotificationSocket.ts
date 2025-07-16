import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useNotificationSocket() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      console.log(
        "LOG: useNotificationSocket - No socket instance, skipping listener setup."
      );
      return;
    }

    console.log(
      "LOG: useNotificationSocket - Setting up 'NEW_NOTIFICATION' listener."
    );
    const handleNewNotification = (event: { payload: any }) => {
      const newNotification = event.payload;
      console.log(
        "LOG: useNotificationSocket - 'NEW_NOTIFICATION' event received",
        event
      );

      toast.info(newNotification.message, {
        description: `Severity: ${newNotification.severity}`,
      });

      queryClient.setQueryData<any>(
        ["notifications"],
        (oldData: { data: any; total: number; unreadCount: any }) => {
          console.log(
            "LOG: useNotificationSocket - Updating query cache for ['notifications']. Old data:",
            oldData
          );

          if (!oldData) {
            const newData = {
              data: [newNotification],
              total: 1,
              unreadCount: 1,
              page: 1,
              limit: 10,
              totalPages: 1,
            };
            console.log(
              "LOG: useNotificationSocket - No old data found, creating new cache entry:",
              newData
            );
            return newData;
          }

          const newData = {
            ...oldData,
            data: [newNotification, ...(oldData.data || [])],
            total: oldData.total + 1,
            unreadCount: (oldData.unreadCount ?? 0) + 1,
          };
          console.log(
            "LOG: useNotificationSocket - Optimistically updated cache:",
            newData
          );
          return newData;
        }
      );
    };

    socket.on("NEW_NOTIFICATION", handleNewNotification);

    return () => {
      console.log(
        "LOG: useNotificationSocket - Cleaning up 'NEW_NOTIFICATION' listener."
      );
      socket.off("NEW_NOTIFICATION", handleNewNotification);
    };
  }, [socket, queryClient]);
}