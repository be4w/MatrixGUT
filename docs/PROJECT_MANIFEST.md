# Project Manifest

## Visão Geral
- **Propósito**: Sistema de gerenciamento de tarefas com priorização automática via Matriz GUT (Gravidade, Urgência, Tendência).
- **Fase**: MVP funcional (single-user).
- **Status**: Estável e pronto para documentação formal.

## Stack Tecnológica

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS + Shadcn UI (Radix Primitives)
- **State Management**: TanStack React Query (server state), useState (local UI state)

### Backend
- **Server**: Express.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM

### Validação
- **Schema Validation**: Zod (schemas compartilhados em `/shared`)

## Estrutura de Pastas

```
/client
  /src
    /pages
      home.tsx (página principal + lógica de priorização)
    /components
      add-task-form.tsx
      task-list.tsx
      focus-mode.tsx
    /lib
      (utilitários e configurações)
/server
  index.ts (servidor Express)
  routes.ts (rotas da API)
/db
  index.ts (conexão com banco)
  schema.ts (definição de tabelas Drizzle)
/shared
  schema.ts (schemas Zod compartilhados)
```

## Fluxo de Dados

1. **Usuário interage** com componente React.
2. **Componente dispara** mutation/query do React Query.
3. **React Query faz** request HTTP para `/api/tasks`.
4. **Express processa** via `routes.ts`.
5. **Drizzle ORM** executa query no PostgreSQL (Neon).
6. **Resposta retorna** e React Query atualiza cache automaticamente.
7. **UI re-renderiza** com novos dados.

## Decisões Arquiteturais

### Por que React Query?
- Elimina necessidade de Redux/Context API para dados do servidor.
- Cache automático e invalidação inteligente.
- Retry e loading states nativos.

### Por que Drizzle ORM?
- Type-safe (TypeScript nativo).
- Performance superior a Prisma em queries complexas.
- Schema como código (migrations automáticas).

### Por que Zod em `/shared`?
- Validação idêntica frontend/backend.
- Source of truth único para tipos.
- Runtime validation (segurança contra dados corrompidos).
