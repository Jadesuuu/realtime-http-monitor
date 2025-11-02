import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Response } from "@/types/api.types";
import { Activity, Server, Code } from "lucide-react";

interface ResponseDetailsSheetProps {
  response: Response | null;
  open: boolean;
  onClose: () => void;
}

export function ResponseDetailsSheet({
  response,
  open,
  onClose,
}: ResponseDetailsSheetProps) {
  if (!response) return null;

  const parseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  const requestData = parseJSON(response.requestPayload);
  const responseData = parseJSON(response.responseData);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Response Details #{response.id}
          </SheetTitle>
          <SheetDescription>
            {new Date(response.timestamp).toLocaleString()}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-6">
            {/* Overview */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Server className="h-4 w-4" />
                Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status Code</p>
                  <Badge
                    variant={
                      response.statusCode === 200 ? "default" : "destructive"
                    }
                  >
                    {response.statusCode}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Response Time</p>
                  <p className="text-sm font-mono font-semibold">
                    {response.responseTime}ms
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Origin IP</p>
                  <p className="text-sm font-mono">
                    {responseData?.origin || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Method</p>
                  <p className="text-sm font-mono">
                    {responseData?.method || "POST"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Request Payload */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Code className="h-4 w-4" />
                Request Payload
              </h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(requestData, null, 2)}
                </pre>
              </div>
            </div>

            <Separator />

            {/* Response Data */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Response Data
              </h3>

              {/* Headers */}
              {responseData?.headers && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Headers
                  </p>
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    {Object.entries(responseData.headers).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start gap-2 text-xs"
                        >
                          <span className="font-semibold min-w-32">{key}:</span>
                          <span className="font-mono text-muted-foreground break-all">
                            {String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Full Response */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Full Response
                </p>
                <div className="rounded-lg bg-muted p-4">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(responseData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
