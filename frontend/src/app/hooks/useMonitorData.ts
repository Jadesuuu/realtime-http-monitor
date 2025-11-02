import { useState, useEffect } from "react";
import { Response, MonitorStats } from "@/types/api.types";

export function useMonitorData() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/api/monitor/responses");

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setResponses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerPing = async () => {
    try {
      await fetch("http://localhost:3001/api/monitor/trigger", {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to trigger ping:", err);
    }
  };

  const addResponse = (newResponse: Response) => {
    setResponses((prev) => [newResponse, ...prev]);
  };

  const calculateStats = (): MonitorStats => {
    if (responses.length === 0) {
      return {
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        failedRequests: 0,
        lastPingTime: "N/A",
      };
    }

    const successCount = responses.filter((r) => r.statusCode === 200).length;
    const totalResponseTime = responses.reduce(
      (sum, r) => sum + (r.responseTime || 0),
      0
    );

    return {
      totalRequests: responses.length,
      successRate: (successCount / responses.length) * 100,
      avgResponseTime: Math.round(totalResponseTime / responses.length),
      failedRequests: responses.length - successCount,
      lastPingTime: responses[0]?.timestamp || "N/A",
    };
  };

  return {
    responses,
    loading,
    error,
    stats: calculateStats(),
    triggerPing,
    addResponse,
    refetch: fetchData,
  };
}
