import { pgTable, serial, text, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";
import { users } from "./models/auth";

export const turmas = pgTable("turmas", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  ano: integer("ano").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const redacoes = pgTable("redacoes", {
  id: serial("id").primaryKey(),
  alunoId: varchar("aluno_id").references(() => users.id).notNull(),
  turmaId: integer("turma_id").references(() => turmas.id).notNull(),
  titulo: text("titulo").notNull(),
  texto: text("texto").notNull(),
  nota: integer("nota"),
  comentario: text("comentario"),
  status: varchar("status", { enum: ["pendente", "corrigido"] }).default("pendente").notNull(),
  palavras: integer("palavras").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  corrigidoEm: timestamp("corrigido_em"),
});

export const turmasRelations = relations(turmas, ({ many }) => ({
  alunos: many(users),
  redacoes: many(redacoes),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  turma: one(turmas, {
    fields: [users.turmaId],
    references: [turmas.id],
  }),
  redacoes: many(redacoes),
}));

export const redacoesRelations = relations(redacoes, ({ one }) => ({
  aluno: one(users, {
    fields: [redacoes.alunoId],
    references: [users.id],
  }),
  turma: one(turmas, {
    fields: [redacoes.turmaId],
    references: [turmas.id],
  }),
}));

export const insertTurmaSchema = createInsertSchema(turmas).omit({ id: true, createdAt: true });
export type InsertTurma = z.infer<typeof insertTurmaSchema>;
export type Turma = typeof turmas.$inferSelect;

export const insertRedacaoSchema = createInsertSchema(redacoes).omit({ id: true, createdAt: true, corrigidoEm: true });
export type InsertRedacao = z.infer<typeof insertRedacaoSchema>;
export type Redacao = typeof redacoes.$inferSelect;

export type CreateRedacaoRequest = InsertRedacao;
export type UpdateRedacaoRequest = Partial<InsertRedacao>;
export type EvaluateRedacaoRequest = {
  nota: number;
  comentario: string;
};
