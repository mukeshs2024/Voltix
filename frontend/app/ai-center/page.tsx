"use client";

import React, { useEffect, useState } from "react";
import { LiveDashboard } from "@/components/dashboard/live/live-dashboard";
import { getDigitalTwinSession, getSimulationStorageKey } from "@/lib/agent-workbench";
import { getRealLatestSession } from "@/lib/api-client";

export default function AICenterPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionData = async () => {
    try {
      // First try real latest session endpoint from backend
      const latest = await getRealLatestSession();
      if (latest) {
        setSession(latest);
        setLoading(false);
        return;
      }

      // Session storage fallback
      const sid = typeof window !== "undefined" ? sessionStorage.getItem(getSimulationStorageKey()) : null;
      if (sid) {
        const data = await getDigitalTwinSession(sid);
        setSession(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
    const interval = setInterval(() => {
      fetchSessionData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LiveDashboard
      scenarioName={session?.scenario_name || "Morning Office Rush"}
      status={session?.global_status?.toUpperCase() || "RUNNING"}
      kpiData={
        session?.building_state
          ? {
              buildingLoadKw: session.building_state.power_usage || 1380,
              gridImportKw: 930,
              solarGenerationKw: 450,
              batterySocPct: 78,
              hvacPowerKw: 620,
              lightingPowerKw: 140,
              energyCostHourlyUSD: 165.6,
              monthlySavingsUSD: 12500,
            }
          : undefined
      }
    />
  );
}
