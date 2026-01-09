"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StrokeRiskResult } from "@/lib/types";

const Sparkline = dynamic(
  () => import("@/components/shared/Sparkline").then((mod) => mod.Sparkline),
  {
    ssr: false,
    loading: () => (
      <div className="h-[50px] w-full bg-muted/20 animate-pulse rounded" />
    ),
  }
);

export default function AnalyticsPage() {
  const [scans, setScans] = useState<StrokeRiskResult[]>([]);

  useEffect(() => {
    api.history.getScans().then(setScans);
  }, []);

  const avgRisk = scans.length
    ? Math.round(scans.reduce((s, x) => s + x.riskScore, 0) / scans.length)
    : 0;

  return (
    <RequireAuth>
      <div className="container py-8 space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Risk Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <Sparkline
                data={scans.map((s, i) => ({
                  date: String(i + 1),
                  value: s.riskScore,
                }))}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgRisk}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{scans.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
