import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type RedacaoInput = z.infer<typeof api.redacoes.create.input>;
type EvaluateInput = z.infer<typeof api.redacoes.evaluate.input>;

export function useRedacoes(filters?: { turmaId?: number; status?: 'pendente' | 'corrigido' }) {
  return useQuery({
    queryKey: [api.redacoes.list.path, filters],
    queryFn: async () => {
      const url = new URL(api.redacoes.list.path, window.location.origin);
      if (filters?.turmaId) url.searchParams.append('turmaId', String(filters.turmaId));
      if (filters?.status) url.searchParams.append('status', filters.status);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch redações");
      
      return api.redacoes.list.responses[200].parse(await res.json());
    },
  });
}

export function useRedacao(id: number) {
  return useQuery({
    queryKey: [api.redacoes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.redacoes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch redação");
      
      return api.redacoes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateRedacao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: RedacaoInput) => {
      const res = await fetch(api.redacoes.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit redação");
      }
      return api.redacoes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.redacoes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.dashboard.metrics.path] });
      toast({ title: "Sucesso", description: "Redação enviada com sucesso!" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  });
}

export function useEvaluateRedacao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EvaluateInput }) => {
      const url = buildUrl(api.redacoes.evaluate.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to evaluate redação");
      }
      return api.redacoes.evaluate.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.redacoes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.redacoes.get.path] });
      queryClient.invalidateQueries({ queryKey: [api.dashboard.metrics.path] });
      toast({ title: "Avaliada", description: "Nota e comentários salvos com sucesso." });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  });
}
