# Dependências Críticas e Pontos de Falha Únicos (SPOF)

## 1. Lógica de Priorização

### Localização
- **Arquivo**: `client/src/pages/home.tsx`
- **Linhas**: 34-38
- **Código**:
```typescript
  const priority = impact * urgency * tendency;
```

### O que faz
Calcula a prioridade de cada tarefa multiplicando os três fatores da Matriz GUT:
- Impact (Gravidade): 1-5
- Urgency (Urgência): 1-5
- Tendency (Tendência): 1-5
- Resultado: 1-125 (quanto maior, mais prioritária)

### Por que é crítico
- É o CORE do produto (sem isso, é só uma lista comum).
- Usado para ordenação em `TaskList`.
- Usado para determinar qual task mostrar em `FocusMode`.

### Dependências
- Depende de: valores `impact`, `urgency`, `tendency` vindos do banco.
- É usado por: função `sort()` para ordenar tasks.
- Afeta: toda a UI de exibição de tarefas.

### Riscos
- ⚠️ Qualquer mudança na fórmula altera TODAS as prioridades.
- ⚠️ Se mudar de multiplicação para média, tasks ficam desordenadas.
- ⚠️ Não há validação de valores 0 (causaria prioridade 0 inesperada).

### Regra
🚨 **NUNCA modificar sem:**
1. Testes manuais extensivos
2. Aprovação explícita do usuário
3. Backup do código atual

## 2. Conexão com Banco de Dados

### Localização
- **Arquivo**: `server/db/index.ts`
- **Código**: Configuração Drizzle + Neon

### O que faz
Estabelece conexão única com PostgreSQL (via pooling do Neon).

### Por que é crítico
- Se falhar, TODO o backend para de funcionar.
- Sem connection pooling, app fica lento.

### Dependências
- Depende de: variável de ambiente `DATABASE_URL`.
- É usado por: todas as rotas em `server/routes.ts`.

### Riscos
- ⚠️ Se `DATABASE_URL` mudar, app quebra totalmente.
- ⚠️ Sem tratamento de erro, falha silenciosa.

### Regra
🚨 Sempre validar `DATABASE_URL` existe no startup.

## 3. Rotas da API

### Localização
- **Arquivo**: `server/routes.ts`

### O que faz
Define todos os endpoints REST:
- GET /api/tasks (listar)
- POST /api/tasks (criar)
- PATCH /api/tasks/:id (atualizar)
- DELETE /api/tasks/:id (deletar)

### Por que é crítico
- Único ponto de entrada para dados.
- Se uma rota quebrar, feature correspondente para.

### Dependências
- Depende de: `db/index.ts` (conexão).
- Depende de: `shared/schema.ts` (validação).
- É usado por: React Query no frontend.

### Riscos
- ⚠️ Mudanças nos endpoints quebram React Query keys.
- ⚠️ Remover validação Zod abre brecha de segurança.

### Regra
🚨 Manter contract da API estável (versionar se precisar mudar).

## 4. Componentes Fundamentais

### `add-task-form.tsx`
- **Responsabilidade**: Formulário de criação de novas tarefas.
- **Pontos de Atenção**: Validação client-side E server-side.

### `task-list.tsx`
- **Responsabilidade**: Exibir lista ordenada de tarefas.
- **Pontos de Atenção**: Ordenação DEVE ser consistente (sempre decrescente).

### `focus-mode.tsx`
- **Responsabilidade**: Exibir APENAS a tarefa de maior prioridade.
- **Pontos de Atenção**: Se não houver tasks, exibir estado vazio (não crashar).
