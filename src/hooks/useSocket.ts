import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      if (socket) {
        console.log("LOG: No access token, disconnecting socket.");
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    console.log("LOG: Access token found, creating new socket connection.");
    const newSocket = io("http://localhost:3000", {
      auth: {
        token: accessToken,
      },
    });

    newSocket.on("connect", () => {
      console.log("LOG: Socket connected successfully with ID:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("LOG: Socket disconnected. Reason:", reason);
    });

    setSocket(newSocket);

    return () => {
      console.log("LOG: Cleaning up socket connection.");
      newSocket.disconnect();
    };
  }, [accessToken]);

  return socket;
}