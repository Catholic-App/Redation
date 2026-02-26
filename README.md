# 📝 Plataforma SaaS de Redações para Escolas

Sistema completo de gestão de redações escolares com controle de acesso por papéis (RBAC), correção online, dashboards e análise de desempenho.

## 🚀 Funcionalidades

### 👨‍🎓 Alunos
- ✍️ Editor de redações com contador de palavras em tempo real
- 📊 Dashboard com histórico e gráficos de evolução
- 🎯 Visualização de notas e comentários detalhados dos professores
- 📈 Gráfico de desempenho individual

### 👨‍🏫 Professores
- 📋 Visualização de todas as redações da turma
- 🔍 Filtros por turma e status (pendente/corrigida)
- ✅ Sistema de correção com notas e comentários
- 📊 Dashboard com estatísticas da turma
- 🏆 Ranking de alunos por média

### 🏫 Administradores
- 👥 Gestão de professores e alunos
- 🏛️ Criação e gerenciamento de turmas
- 📊 Dashboard geral com métricas completas
- 👤 Associação de usuários a turmas

## 🛠️ Stack Tecnológica

### Frontend
- **React** com TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **TanStack Query** - State management e cache
- **Wouter** - Roteamento
- **TipTap** - Editor de texto rico
- **Recharts** - Gráficos e visualizações
- **Framer Motion** - Animações

### Backend
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados (via Replit Database)
- **Drizzle ORM** - Type-safe SQL
- **Passport.js** - Autenticação
- **Replit Auth** - Autenticação OAuth (Google, GitHub, Apple, Email)

## 📁 Estrutura do Projeto

```
.
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── app-sidebar.tsx
│   │   │   └── rich-editor.tsx
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── landing.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── redacoes/
│   │   │   └── turmas/
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilitários
│   └── index.css
│
├── server/                    # Backend Express
│   ├── db.ts                 # Configuração do banco
│   ├── storage.ts            # Camada de dados
│   ├── routes.ts             # Rotas da API
│   └── replit_integrations/  # Autenticação Replit
│       └── auth/
│
├── shared/                    # Código compartilhado
│   ├── schema.ts             # Esquemas Drizzle + Zod
│   ├── routes.ts             # Contrato da API
│   └── models/
│       └── auth.ts
│
└── drizzle.config.ts         # Configuração do Drizzle
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas

#### `users`
- `id` - UUID (primary key)
- `email` - Email único
- `firstName`, `lastName` - Nomes
- `profileImageUrl` - Avatar
- `role` - Papel: `student`, `teacher`, `admin`
- `turmaId` - Foreign key para turmas (nullable)
- `createdAt`, `updatedAt`

#### `turmas`
- `id` - Serial (primary key)
- `nome` - Nome da turma
- `ano` - Ano letivo
- `createdAt`

#### `redacoes`
- `id` - Serial (primary key)
- `alunoId` - Foreign key para users
- `turmaId` - Foreign key para turmas
- `titulo` - Título da redação
- `texto` - Conteúdo completo
- `nota` - Nota de 0-100 (nullable)
- `comentario` - Feedback do professor (nullable)
- `status` - `pendente` ou `corrigido`
- `palavras` - Contador de palavras
- `createdAt`, `corrigidoEm`

#### `sessions`
- Tabela de sessões do Passport.js (gerenciada automaticamente)

## 🔐 Autenticação e Autorização

### Sistema RBAC (Role-Based Access Control)

A aplicação implementa controle de acesso baseado em papéis:

- **Alunos** só veem suas próprias redações
- **Professores** veem redações de suas turmas
- **Admins** têm acesso total ao sistema

### Fluxo de Autenticação

1. Usuário clica em "Entrar" na landing page
2. Redirecionado para `/api/login` (Replit Auth)
3. Escolhe método: Google, GitHub, Apple ou Email
4. Após login, retorna para o dashboard apropriado
5. Role determina quais páginas/ações estão disponíveis

### Rotas Protegidas

Todas as rotas `/api/*` (exceto login/logout) requerem autenticação via middleware `isAuthenticated`.

## 📡 API Endpoints

### Autenticação
- `GET /api/login` - Iniciar login
- `GET /api/logout` - Fazer logout
- `GET /api/auth/user` - Obter usuário atual

### Usuários
- `GET /api/users` - Listar todos os usuários
- `PUT /api/users/:id` - Atualizar role/turma

### Turmas
- `GET /api/turmas` - Listar turmas
- `POST /api/turmas` - Criar turma

### Redações
- `GET /api/redacoes` - Listar redações (com filtros)
- `GET /api/redacoes/:id` - Obter redação específica
- `POST /api/redacoes` - Criar nova redação
- `PATCH /api/redacoes/:id/evaluate` - Avaliar redação

### Dashboard
- `GET /api/dashboard/metrics` - Métricas e estatísticas

## 🚀 Configuração e Deploy

### Desenvolvimento Local (Replit)

1. **Clone o projeto no Replit**

2. **Configure as variáveis de ambiente** (automático no Replit):
   - `DATABASE_URL` - Provisionado automaticamente
   - `SESSION_SECRET` - Provisionado automaticamente
   - `REPL_ID` - Provisionado automaticamente

3. **Execute as migrações**:
```bash
npm run db:push
```

4. **Inicie o servidor**:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

### Deploy na Vercel

#### Preparação

1. **Configure o banco de dados Supabase**:
   - Crie um projeto em [supabase.com](https://supabase.com)
   - Copie a `DATABASE_URL` (connection string)
   - Execute o schema SQL (veja próxima seção)

2. **Gere um SESSION_SECRET**:
```bash
openssl rand -base64 32
```

#### Configuração Vercel

1. **Instale a Vercel CLI**:
```bash
npm i -g vercel
```

2. **Configure variáveis de ambiente na Vercel**:
```bash
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
```

3. **Deploy**:
```bash
vercel --prod
```

#### Configuração do Replit Auth para Produção

Após o deploy, você precisa atualizar as URLs de callback:

1. Acesse [Replit Identity Settings](https://replit.com/account#identity)
2. Adicione seu domínio Vercel aos "Allowed Callback URLs":
   - `https://seu-app.vercel.app/api/callback`

### Scripts SQL para Supabase

Execute este SQL no Supabase SQL Editor:

```sql
-- Tabela de sessões
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX "IDX_session_expire" ON sessions (expire);

-- Tabela de usuários
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  role VARCHAR DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  turma_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de turmas
CREATE TABLE turmas (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  ano INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de redações
CREATE TABLE redacoes (
  id SERIAL PRIMARY KEY,
  aluno_id VARCHAR REFERENCES users(id) NOT NULL,
  turma_id INTEGER REFERENCES turmas(id) NOT NULL,
  titulo TEXT NOT NULL,
  texto TEXT NOT NULL,
  nota INTEGER,
  comentario TEXT,
  status VARCHAR DEFAULT 'pendente' CHECK (status IN ('pendente', 'corrigido')),
  palavras INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  corrigido_em TIMESTAMP
);

-- Seed data
INSERT INTO turmas (nome, ano) VALUES
  ('3º Ano A - Ensino Médio', 2024),
  ('3º Ano B - Ensino Médio', 2024),
  ('Cursinho Pré-Vestibular', 2024);
```

### Row Level Security (RLS) no Supabase

Para segurança adicional, configure RLS:

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE redacoes ENABLE ROW LEVEL SECURITY;

-- Política para usuários (podem ver apenas seu próprio perfil)
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Política para redações (alunos veem apenas suas redações)
CREATE POLICY "Students can view own redacoes"
  ON redacoes FOR SELECT
  USING (aluno_id = auth.uid());

-- Professores veem redações de suas turmas
CREATE POLICY "Teachers can view turma redacoes"
  ON redacoes FOR SELECT
  USING (
    turma_id IN (
      SELECT turma_id FROM users WHERE id = auth.uid() AND role = 'teacher'
    )
  );
```

## 🎨 Personalização

### Temas e Cores

Edite `client/src/index.css` para personalizar as cores:

```css
:root {
  --primary: 220 90% 56%;      /* Cor principal */
  --secondary: 220 14.3% 95.9%; /* Cor secundária */
  /* ... */
}
```

### Logo e Branding

Substitua os arquivos em `client/public/`:
- `favicon.png` - Ícone do navegador
- Adicione seu logo em `client/public/logo.png`

## 📊 Estrutura SaaS

A aplicação está preparada para evolução comercial:

### Planos Futuros

- **Gratuito**: Limite de 10 redações/mês
- **Pro**: Redações ilimitadas
- **Enterprise**: White-label + API

### Integração Stripe (preparado, não implementado)

O código está estruturado para adicionar:

```typescript
// Exemplo de integração futura
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/subscribe', async (req, res) => {
  // Criar sessão de checkout
  const session = await stripe.checkout.sessions.create({
    // ...
  });
  res.json({ url: session.url });
});
```

## 🧪 Testando a Aplicação

### Como Testar

1. **Login**:
   - Acesse a aplicação
   - Clique em "Entrar"
   - Faça login com Google/GitHub/Email

2. **Como Aluno**:
   - Navegue para "Nova Redação"
   - Escreva uma redação com pelo menos 100 palavras
   - Envie e veja no histórico

3. **Como Professor** (altere o role via admin):
   - Veja redações pendentes no dashboard
   - Acesse "Correção"
   - Avalie uma redação com nota e comentário

4. **Como Admin**:
   - Crie novas turmas
   - Gerencie usuários e roles

### Alterando Roles

Via SQL (temporário para testes):

```sql
UPDATE users SET role = 'teacher' WHERE email = 'seu-email@example.com';
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

Ou use a interface admin após criar um usuário admin.

## 🐛 Troubleshooting

### Erro "Unauthorized" ao acessar rotas

- Verifique se fez login em `/api/login`
- Limpe cookies e tente novamente
- Verifique `SESSION_SECRET` está configurado

### Banco de dados não conecta

- Verifique `DATABASE_URL` nas variáveis de ambiente
- Execute `npm run db:push` para criar tabelas
- No Supabase, verifique se o IP está na whitelist

### Editor não carrega

- Verifique se os pacotes TipTap estão instalados:
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

## 📝 Licença

Este projeto está pronto para uso comercial. Personalize conforme necessário.

## 🤝 Suporte

Para dúvidas e suporte:
- Abra uma issue no repositório
- Entre em contato com o administrador

---

**Desenvolvido com ❤️ para transformar a educação**