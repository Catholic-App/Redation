import { sql } from "drizzle-orm";
import { pgTable, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), 
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  password: varchar("password"),
  role: varchar("role", { enum: ["student", "teacher", "admin"] }).default("student").notNull(),
  turmaId: integer("turma_id"),
  isFirstLogin: boolean("is_first_login").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
