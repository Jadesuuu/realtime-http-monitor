"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ResponseTable } from "./dashboard/ResponseTable";
import { ResponseTimeChart } from "./dashboard/ResponseTimeChart";
import { useMonitorData } from "./hooks/useMonitorData";

/**
 * Dashboard Page Component
 *
 * Main entry point for the HTTP monitoring dashboard.
 * Data fetching logic is isolated in custom hooks (useMonitorData)
 * Abstraction for re-rendering optimization, only components that depend on changed data are re-rendered
 */
export default function Dashboard() {
  const { responses, isConnected, loading, triggerPing } = useMonitorData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Button disabled size="sm">
          <Spinner />
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">HTTP Monitor Dashboard</h1>
          <div className="flex gap-4 items-center">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </Badge>
            <Button onClick={triggerPing}>Trigger Ping</Button>
          </div>
        </div>

        {/* Chart */}
        <ResponseTimeChart responses={responses} />

        {/* Table */}
        <ResponseTable responses={responses} />
      </div>
    </div>
  );
}
