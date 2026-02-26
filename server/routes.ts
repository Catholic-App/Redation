import type { Express, Request } from "express";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// A interface AuthRequest agora é importada de `auth.ts` onde é definida
import { AuthRequest } from "./auth";

export async function registerRoutes(app: Express): Promise<void> {

  // Rota para obter o usuário logado
  app.get("/api/me", (req: Request, res) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    res.json(authReq.user);
  });

  // Users API
  app.get(api.users.list.path, async (req, res) => {
    const list = await storage.getUsers();
    res.json(list);
  });

  // Esta rota de verificação de código era específica da lógica de primeiro login do Replit.
  // Com a nova autenticação, a lógica de atribuição de papéis (admin/teacher) precisa ser repensada.
  // Por enquanto, vamos desativá-la e o administrador pode atribuir papéis manualmente.
  /*
  app.post(api.users.verifyCode.path, async (req: Request, res) => {
    const authReq = req as AuthRequest;
    try {
      const { code, targetRole } = api.users.verifyCode.input.parse(req.body);
      const user = authReq.user;

      if (!user) return res.status(401).json({ message: "Usuário não encontrado" });

      const ADMIN_CODE = "ADMIN1234";
      const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || "PROF9999";

      let newRole = user.role;
      if (targetRole === 'admin' && code === ADMIN_CODE) {
        newRole = 'admin';
      } else if (targetRole === 'teacher' && code === TEACHER_CODE) {
        newRole = 'teacher';
      }

      if (newRole !== user.role) {
        await storage.updateUser(user.id, { role: newRole });
        return res.json({ success: true, message: `Acesso de ${newRole} concedido` });
      }

      res.status(400).json({ success: false, message: "Código inválido" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: err.errors[0].message });
      }
      res.status(500).json({ success: false, message: "Internal Error" });
    }
  });
  */

  app.put(api.users.update.path, async (req, res) => {
    try {
      const input = api.users.update.input.parse(req.body);
      const user = await storage.updateUser(req.params.id, input);
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  // Turmas API
  app.get(api.turmas.list.path, async (req, res) => {
    const list = await storage.getTurmas();
    res.json(list);
  });

  app.post(api.turmas.create.path, async (req, res) => {
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
  app.get(api.redacoes.list.path, async (req, res) => {
    const list = await storage.getRedacoes();
    res.json(list);
  });

  app.get(api.redacoes.get.path, async (req, res) => {
    const redacao = await storage.getRedacao(Number(req.params.id));
    if (!redacao) return res.status(404).json({ message: "Not found" });
    res.json(redacao);
  });

  app.post(api.redacoes.create.path, async (req: Request, res) => {
    const authReq = req as AuthRequest;
    try {
      const schema = api.redacoes.create.input.extend({
        turmaId: z.coerce.number(),
        palavras: z.coerce.number(),
      });
      const input = schema.parse(req.body);
      
      const redacao = await storage.createRedacao({
        ...input,
        alunoId: authReq.user!.id
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

  app.patch(api.redacoes.evaluate.path, async (req, res) => {
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

  // Dashboard API
  app.get(api.dashboard.metrics.path, async (req, res) => {
    const redacoes = await storage.getRedacoes();
    const pendentes = redacoes.filter(r => r.status === "pendente").length;
    const corrigidas = redacoes.filter(r => r.status === "corrigido");
    
    const media = corrigidas.length > 0 
      ? corrigidas.reduce((acc, curr) => acc + (curr.nota || 0), 0) / corrigidas.length 
      : 0;

    res.json({
      mediaTurma: Math.round(media),
      totalEnviadas: redacoes.length,
      totalPendentes: pendentes,
      evolucaoNotas: [], // Lógica de evolução de notas precisa ser implementada
      ranking: [], // Lógica de ranking precisa ser implementada
    });
  });
  
  // A função de seed não deve ser chamada em cada inicialização em produção
  // await seedDatabase(); 
}

// A função de seed pode ser movida para um script separado para ser executada manualmente
/*
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
*/
