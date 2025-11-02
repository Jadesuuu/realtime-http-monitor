import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Response } from "@/types/api.types";
import { Activity, CheckCircle2, XCircle, Clock } from "lucide-react";

interface LiveActivityFeedProps {
  responses: Response[];
}

export function LiveActivityFeed({ responses }: LiveActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new response arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [responses]);

  const recentResponses = responses.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live Activity Feed
        </CardTitle>
        <CardDescription>Real-time monitoring updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]" ref={scrollRef}>
          <div className="space-y-3">
            {recentResponses.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Waiting for activity...</p>
              </div>
            ) : (
              recentResponses.map((response, index) => (
                <div
                  key={response.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
                    index === 0 ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-full ${
                      response.statusCode === 200
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    {response.statusCode === 200 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Request #{response.id}
                      </p>
                      <Badge
                        variant={
                          response.statusCode === 200
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {response.statusCode}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {response.responseTime}ms
                      </span>
                      <span>
                        {new Date(response.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* New indicator */}
                  {index === 0 && (
                    <Badge variant="outline" className="text-xs">
                      NEW
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
