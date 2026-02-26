import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Wait for auth to setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Users API
  app.get(api.users.list.path, isAuthenticated, async (req, res) => {
    const list = await storage.getUsers();
    res.json(list);
  });

  // Turmas API
  app.get(api.turmas.list.path, isAuthenticated, async (req, res) => {
    const list = await storage.getTurmas();
    res.json(list);
  });

  app.post(api.turmas.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.turmas.create.input.parse(req.body);
      const turma = await storage.createTurma(input);
      res.status(201).json(turma);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  // Redacoes API
  app.get(api.redacoes.list.path, isAuthenticated, async (req, res) => {
    // simplified filters
    const list = await storage.getRedacoes();
    res.json(list);
  });

  app.get(api.redacoes.get.path, isAuthenticated, async (req, res) => {
    const redacao = await storage.getRedacao(Number(req.params.id));
    if (!redacao) return res.status(404).json({ message: "Not found" });
    res.json(redacao);
  });

  app.post(api.redacoes.create.path, isAuthenticated, async (req, res) => {
    try {
      // Coerce turmaId if it comes as string
      const schema = api.redacoes.create.input.extend({
        turmaId: z.coerce.number(),
        palavras: z.coerce.number(),
      });
      const input = schema.parse(req.body);
      
      const redacao = await storage.createRedacao({
        ...input,
        alunoId: (req.user as any).claims.sub
      });
      res.status(201).json(redacao);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error(err);
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.patch(api.redacoes.evaluate.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.redacoes.evaluate.input.parse(req.body);
      const redacao = await storage.evaluateRedacao(Number(req.params.id), input.nota, input.comentario);
      res.json(redacao);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.dashboard.metrics.path, isAuthenticated, async (req, res) => {
    const redacoes = await storage.getRedacoes();
    
    // Mock calculations for the dashboard
    const pendentes = redacoes.filter(r => r.status === "pendente").length;
    const corrigidas = redacoes.filter(r => r.status === "corrigido");
    
    const media = corrigidas.length > 0 
      ? corrigidas.reduce((acc, curr) => acc + (curr.nota || 0), 0) / corrigidas.length 
      : 0;

    res.json({
      mediaTurma: Math.round(media),
      totalEnviadas: redacoes.length,
      totalPendentes: pendentes,
      evolucaoNotas: [
        { data: "Semana 1", nota: 75 },
        { data: "Semana 2", nota: 80 },
        { data: "Semana 3", nota: 85 },
      ],
      ranking: [
        { aluno: "João Silva", media: 95 },
        { aluno: "Maria Costa", media: 92 },
        { aluno: "Pedro Santos", media: 88 },
      ]
    });
  });

  // Seed DB immediately if needed
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const turmasList = await storage.getTurmas();
    if (turmasList.length === 0) {
      await storage.createTurma({ nome: "3º Ano A - Ensino Médio", ano: 2024 });
      await storage.createTurma({ nome: "3º Ano B - Ensino Médio", ano: 2024 });
      await storage.createTurma({ nome: "Cursinho Pré-Vestibular", ano: 2024 });
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}