import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { storage } from "./storage";
import { User } from "@shared/schema";

// --- Configuração ---
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-default-key";
const JWT_EXPIRATION = "7d"; // 7 dias

// --- Tipos e Schemas ---
export interface AuthRequest extends Request {
  user?: User;
}

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
});

// --- Funções de Autenticação ---

/**
 * Gera um token JWT para o usuário.
 * @param user O objeto de usuário.
 * @returns O token JWT.
 */
export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
}

/**
 * Middleware para verificar o token JWT e autenticar o usuário.
 */
export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    
    const user = await storage.getUserById(decoded.id);
    if (!user) {
        return res.status(401).json({ message: "Token inválido. Usuário não encontrado." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido ou expirado." });
  }
};

/**
 * Função para lidar com o login de usuário.
 */
export async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await storage.getUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = generateToken(user);
    // Retorna o token e os dados básicos do usuário
    return res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

/**
 * Função para lidar com o registro de usuário.
 */
export async function handleRegister(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(409).json({ message: "Email já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await storage.createUser({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      // O primeiro login é sempre como 'student' por padrão
      role: 'student', 
      isFirstLogin: false, // Já que está se registrando, não é o "primeiro login" no sentido de Replit Auth
    });

    const token = generateToken(newUser);
    return res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName, role: newUser.role } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error("Erro no registro:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
