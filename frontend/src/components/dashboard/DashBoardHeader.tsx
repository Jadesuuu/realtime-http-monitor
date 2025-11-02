// frontend/components/dashboard/DashboardHeader.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Zap } from "lucide-react";

interface DashboardHeaderProps {
  isConnected: boolean;
  onTriggerPing: () => void;
}

export function DashboardHeader({
  isConnected,
  onTriggerPing,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HTTP Monitor</h1>
          <p className="text-sm text-muted-foreground">
            Real-time endpoint monitoring dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge
          variant={isConnected ? "default" : "destructive"}
          className="px-3 py-1.5 text-sm"
        >
          <span
            className={`mr-2 h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            } animate-pulse`}
          />
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>

        <Button onClick={onTriggerPing} size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          Trigger Ping
        </Button>
      </div>
    </div>
  );
}
