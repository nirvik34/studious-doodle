"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StrokeRiskResult } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function HistoryPage() {
  const [scans, setScans] = useState<StrokeRiskResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.history
      .getScans()
      .then(setScans)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading history...</div>;

  return (
    <RequireAuth>
      <div className="container py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Scan History</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
          </div>
        </div>

        <div className="space-y-4">
          {scans.map((scan, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {new Date(scan.timestamp).toLocaleDateString()} at{" "}
                    {new Date(scan.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <RiskBadge level={scan.riskLevel} />
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className="text-2xl font-bold">{scan.riskScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-lg">{scan.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Factors</p>
                    <p className="text-sm">{scan.factors.length} detected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {scans.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No scan history found.
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
