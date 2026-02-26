import { User } from "@shared/schema";

const API_BASE_URL = "/api";

interface AuthResponse {
  token: string;
  user: User;
}

export async function login(credentials: any): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao fazer login");
  }

  return response.json();
}

export async function register(userData: any): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao registrar");
  }

  return response.json();
}

export async function fetchCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("jwt_token");
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export function logoutUser(): void {
  localStorage.removeItem("jwt_token");
}
