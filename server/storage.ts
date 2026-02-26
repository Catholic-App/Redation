import { db } from "./db";
import {
  users, turmas, redacoes,
  type User, type Turma, type Redacao,
  type InsertTurma, type InsertRedacao,
  type UpdateRedacaoRequest
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<User>): Promise<User>;

  // Turmas
  getTurmas(): Promise<Turma[]>;
  createTurma(turma: InsertTurma): Promise<Turma>;

  // Redacoes
  getRedacoes(filters?: { turmaId?: number; status?: string }): Promise<Redacao[]>;
  getRedacao(id: number): Promise<Redacao | undefined>;
  createRedacao(redacao: InsertRedacao): Promise<Redacao>;
  updateRedacao(id: number, redacao: UpdateRedacaoRequest): Promise<Redacao>;
  evaluateRedacao(id: number, nota: number, comentario: string): Promise<Redacao>;
}

export class DatabaseStorage implements IStorage {
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  async getTurmas(): Promise<Turma[]> {
    return await db.select().from(turmas);
  }

  async createTurma(turma: InsertTurma): Promise<Turma> {
    const [newTurma] = await db.insert(turmas).values(turma).returning();
    return newTurma;
  }

  async getRedacoes(filters?: { turmaId?: number; status?: string }): Promise<Redacao[]> {
    let query = db.select().from(redacoes).orderBy(desc(redacoes.createdAt));
    return await query;
  }

  async getRedacao(id: number): Promise<Redacao | undefined> {
    const [redacao] = await db.select().from(redacoes).where(eq(redacoes.id, id));
    return redacao;
  }

  async createRedacao(redacao: InsertRedacao): Promise<Redacao> {
    const [newRedacao] = await db.insert(redacoes).values(redacao).returning();
    return newRedacao;
  }

  async updateRedacao(id: number, redacao: UpdateRedacaoRequest): Promise<Redacao> {
    const [updated] = await db.update(redacoes).set(redacao).where(eq(redacoes.id, id)).returning();
    return updated;
  }

  async evaluateRedacao(id: number, nota: number, comentario: string): Promise<Redacao> {
    const [updated] = await db.update(redacoes)
      .set({ nota, comentario, status: "corrigido", corrigidoEm: new Date() })
      .where(eq(redacoes.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
