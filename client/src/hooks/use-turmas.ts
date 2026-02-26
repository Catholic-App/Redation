import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type TurmaInput = z.infer<typeof api.turmas.create.input>;

export function useTurmas() {
  return useQuery({
    queryKey: [api.turmas.list.path],
    queryFn: async () => {
      const res = await fetch(api.turmas.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch turmas");
      return api.turmas.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTurma() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: TurmaInput) => {
      const res = await fetch(api.turmas.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create turma");
      return api.turmas.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.turmas.list.path] });
      toast({ title: "Sucesso", description: "Turma criada com sucesso!" });
    },
  });
}
