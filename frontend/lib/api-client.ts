import { resolveBackendUrl } from "@/lib/agent-workbench";
import { Building, AlertItem, AIRecommendation } from "@/types";

export interface DashboardOverviewResponse {
  total_buildings?: number;
  total_energy_mw?: number;
  monthly_savings_usd?: number;
  carbon_reduction_tons?: number;
  average_efficiency_score?: number;
  buildings?: Building[];
  alerts?: AlertItem[];
  recommendations?: AIRecommendation[];
}

export async function fetchFromBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const baseUrl = resolveBackendUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer temp",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      console.warn(`Backend request to ${endpoint} failed with status ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn(`Backend connection error for ${endpoint}:`, error);
    return null;
  }
}

export async function getRealDashboardOverview(): Promise<DashboardOverviewResponse | null> {
  return fetchFromBackend<DashboardOverviewResponse>("/api/v1/dashboard/overview");
}

export async function getRealBuildings(): Promise<Building[] | null> {
  return fetchFromBackend<Building[]>("/api/v1/buildings");
}

export async function getRealAlerts(): Promise<AlertItem[] | null> {
  return fetchFromBackend<AlertItem[]>("/api/v1/alerts");
}

export async function getRealLatestSession(): Promise<any | null> {
  return fetchFromBackend<any>("/api/v1/simulation/session/latest");
}

export async function getRealScenarios(): Promise<any[] | null> {
  return fetchFromBackend<any[]>("/api/v1/scenarios/templates");
}
