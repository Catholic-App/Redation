import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useDashboardMetrics(turmaId?: number) {
  return useQuery({
    queryKey: [api.dashboard.metrics.path, turmaId],
    queryFn: async () => {
      const url = new URL(api.dashboard.metrics.path, window.location.origin);
      if (turmaId) url.searchParams.append('turmaId', String(turmaId));
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
      
      return api.dashboard.metrics.responses[200].parse(await res.json());
    },
  });
}
