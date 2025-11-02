import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Response } from "@/types/api.types";

export function useMonitorData() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch historical data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/monitor/responses");
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
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ WebSocket connected");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ WebSocket disconnected");
    });

    socket.on("newResponse", (newResponse: Response) => {
      console.log("📨 New response:", newResponse.id);
      setResponses((prev) => [newResponse, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const triggerPing = async () => {
    try {
      await fetch("http://localhost:3001/api/monitor/trigger", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error triggering ping:", error);
    }
  };

  return { responses, isConnected, loading, triggerPing };
}
