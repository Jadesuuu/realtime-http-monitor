// frontend/app/page.tsx

"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import { Response } from "@/types/api.types";

import { ResponseTimeChart } from "@/components/dashboard/ResponseTimeChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { ResponseTable } from "@/components/dashboard/ResponseTable";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";
import { DashboardHeader } from "@/components/dashboard/DashBoardHeader";
import { ResponseDetailsSheet } from "@/components/dashboard/ResponseDetailSheet";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { useMonitorData } from "./hooks/useMonitorData";
import { useWebSocket } from "./hooks/useWebSocket";

export default function Dashboard() {
  const { responses, loading, stats, triggerPing, addResponse } =
    useMonitorData();
  const { isConnected } = useWebSocket(addResponse);

  const [selectedResponse, setSelectedResponse] = useState<Response | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewDetails = (response: Response) => {
    setSelectedResponse(response);
    setSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <DashboardHeader
            isConnected={isConnected}
            onTriggerPing={triggerPing}
          />

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <ResponseTimeChart responses={responses} />
            <StatusDistributionChart responses={responses} />
          </div>

          {/* Table and Activity Feed */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ResponseTable
                responses={responses}
                onViewDetails={handleViewDetails}
              />
            </div>
            <div>
              <LiveActivityFeed responses={responses} />
            </div>
          </div>
        </div>
      </div>

      {/* Details Sheet */}
      <ResponseDetailsSheet
        response={selectedResponse}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </>
  );
}
