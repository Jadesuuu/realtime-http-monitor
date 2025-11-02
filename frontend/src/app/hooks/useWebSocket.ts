// frontend/hooks/useWebSocket.ts

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Response } from "@/types/api.types";
import { toast } from "sonner";

export function useWebSocket(onNewResponse: (response: Response) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    const socket: Socket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
    });

    socket.on("connect", () => {
      setIsConnected(true);

      // Only show toast once on initial connection
      if (!hasShownToast) {
        toast.success("Connected", {
          description: "Real-time updates enabled",
          duration: 2000,
        });
        setHasShownToast(true);
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("newResponse", (response: Response) => {
      onNewResponse(response);

      toast.info("New data received", {
        description: `${response.statusCode} • ${response.responseTime}ms`,
        duration: 2000,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewResponse, hasShownToast]);

  return { isConnected };
}
