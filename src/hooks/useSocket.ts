import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io("http://localhost:3000", {
      auth: {
        token: accessToken,
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken]);

  return socket;
}
