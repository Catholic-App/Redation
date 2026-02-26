# Plataforma SaaS de Redações para Escolas

Sistema completo de gestão de redações com controle de acesso por papéis (RBAC).

## Arquitetura

### Frontend (client/)
- **React + TypeScript + Vite**
- **Tailwind CSS + shadcn/ui** para componentes
- **TanStack Query** para state management
- **Wouter** para roteamento
- **TipTap** para editor rico
- **Recharts** para dashboards

### Backend (server/)
- **Express.js** com TypeScript
- **PostgreSQL** via Replit Database
- **Drizzle ORM** para queries type-safe
- **Replit Auth** para autenticação OAuth

### Shared (shared/)
- **schema.ts**: Schemas Drizzle + tipos TypeScript
- **routes.ts**: Contrato da API com Zod
- **models/auth.ts**: Tabelas de autenticação

## Estrutura do Banco

### users
- `role`: student | teacher | admin
- `turmaId`: FK para turmas

### turmas
- Turmas escolares com nome e ano

### redacoes
- `alunoId`: FK para users
- `turmaId`: FK para turmas
- `status`: pendente | corrigido
- `nota`, `comentario`, `palavras`

## Fluxo RBAC

- **Aluno**: vê apenas suas redações
- **Professor**: vê redações de suas turmas, pode corrigir
- **Admin**: gestão completa de turmas e usuários

## Rotas Principais

### Auth
- `/api/login` - Replit Auth
- `/api/logout`
- `/api/auth/user` - User atual

### API
- `GET /api/redacoes` - Lista redações
- `POST /api/redacoes` - Criar redação
- `PATCH /api/redacoes/:id/evaluate` - Avaliar
- `GET /api/dashboard/metrics` - Estatísticas

## Dependências Principais

### NPM Packages
- express, drizzle-orm, pg
- passport, openid-client
- @tiptap/react, @tiptap/starter-kit
- @tanstack/react-query
- tailwindcss, lucide-react

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection
- `SESSION_SECRET` - Session encryption
- `REPL_ID`, `ISSUER_URL` - Replit Auth

## Features Implementadas

✅ Autenticação OAuth (Google, GitHub, Email)  
✅ Editor de redações com contador de palavras  
✅ Sistema de correção com notas e comentários  
✅ Dashboards com gráficos e estatísticas  
✅ Filtros por turma e status  
✅ Ranking de alunos  
✅ Dark mode  
✅ Layout responsivo com sidebar  
✅ Loading states e skeletons  

## Próximos Passos (Estrutura SaaS)

- Limites de plano (redações/mês)
- Integração Stripe para pagamentos
- API pública para integrações
- White-label para escolas