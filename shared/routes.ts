import { z } from 'zod';
import { insertTurmaSchema, insertRedacaoSchema } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users' as const,
      responses: {
        200: z.array(z.any()), // Array of users
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/users/:id' as const,
      input: z.object({
        role: z.enum(['student', 'teacher', 'admin']).optional(),
        turmaId: z.number().nullable().optional(),
        isFirstLogin: z.boolean().optional(),
      }),
      responses: {
        200: z.any(),
        400: errorSchemas.validation,
      }
    },
    verifyCode: {
      method: 'POST' as const,
      path: '/api/auth/verify-code' as const,
      input: z.object({
        code: z.string(),
        targetRole: z.enum(['teacher', 'admin']),
      }),
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ success: z.boolean(), message: z.string() }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  turmas: {
    list: {
      method: 'GET' as const,
      path: '/api/turmas' as const,
      responses: {
        200: z.array(z.any()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/turmas' as const,
      input: insertTurmaSchema,
      responses: {
        201: z.any(),
        400: errorSchemas.validation,
      }
    },
  },
  redacoes: {
    list: {
      method: 'GET' as const,
      path: '/api/redacoes' as const,
      input: z.object({
        turmaId: z.number().optional(),
        status: z.enum(['pendente', 'corrigido']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.any()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/redacoes/:id' as const,
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/redacoes' as const,
      input: insertRedacaoSchema,
      responses: {
        201: z.any(),
        400: errorSchemas.validation,
      }
    },
    evaluate: {
      method: 'PATCH' as const,
      path: '/api/redacoes/:id/evaluate' as const,
      input: z.object({
        nota: z.number().min(0).max(100),
        comentario: z.string().min(1),
      }),
      responses: {
        200: z.any(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    },
  },
  dashboard: {
    metrics: {
      method: 'GET' as const,
      path: '/api/dashboard/metrics' as const,
      input: z.object({ turmaId: z.number().optional() }).optional(),
      responses: {
        200: z.object({
          mediaTurma: z.number(),
          totalEnviadas: z.number(),
          totalPendentes: z.number(),
          evolucaoNotas: z.array(z.object({ data: z.string(), nota: z.number() })),
          ranking: z.array(z.object({ aluno: z.string(), media: z.number() })),
        }),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
