import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Response } from "@/types/api.types";

interface ResponseTableProps {
  responses: Response[];
}

export function ResponseTable({ responses }: ResponseTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(responses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResponses = responses.slice(startIndex, endIndex);

  const parseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response History ({responses.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-32">Response Time</TableHead>
                <TableHead>Origin IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResponses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No data yet. Waiting for first ping...
                  </TableCell>
                </TableRow>
              ) : (
                currentResponses.map((response) => {
                  const responseData = parseJSON(response.responseData);

                  return (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">
                        {response.id}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(response.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            response.statusCode === 200
                              ? "default"
                              : "destructive"
                          }
                        >
                          {response.statusCode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {response.responseTime}ms
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {responseData?.origin || "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
