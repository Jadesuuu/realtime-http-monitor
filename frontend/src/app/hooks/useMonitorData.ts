import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Response } from "@/types/api.types";
import { toast } from "sonner";

/**
 * Environment Configuration
 *
 * Uses Next.js environment variables for deployment flexibility.
 * Fallback to localhost ensures development works without configuration.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";

/**
 * Custom Hook: useMonitorData
 *
 * Encapsulates ALL data-fetching and state management logic
 * useState for client-side state (responses, connection status, loading)
 * useEffect for side effects(API calls, WebSocket setup)
 * Real-time updates via WebSocket connection established on mount
 * updates state based on WebSocket events
 */
export function useMonitorData() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch historical data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/monitor/responses`);
        const data = await res.json();
        setResponses(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // WebSocket connection
  useEffect(() => {
    const socket = io(WS_URL);

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    });

    socket.on("newResponse", (newResponse: Response) => {
      console.log("New response:", newResponse.id);
      setResponses((prev) => [newResponse, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const triggerPing = async () => {
    try {
      await fetch(`${API_URL}/api/monitor/trigger`, {
        method: "POST",
      });

      toast.success("Ping triggered successfully!", {
        id: "trigger-ping",
        description: "Waiting for response...",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error triggering ping:", error);
      toast.error("Failed to trigger ping", {
        id: "trigger-ping",
        description: "Please try again",
        duration: 2000,
      });
    }
  };

  return { responses, isConnected, loading, triggerPing };
}
