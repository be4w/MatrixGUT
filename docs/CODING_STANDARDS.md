# Coding Standards

## Convenções de Nomenclatura

### Arquivos
- **Componentes**: `kebab-case.tsx` (ex: `add-task-form.tsx`)
- **Páginas**: `kebab-case.tsx` (ex: `home.tsx`)
- **Utilitários**: `kebab-case.ts` (ex: `date-helpers.ts`)

### Código
- **Componentes React**: `PascalCase` (ex: `TaskList`)
- **Funções**: `camelCase` (ex: `calculatePriority`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `MAX_TASKS_PER_PAGE`)
- **Interfaces/Types**: `PascalCase` (ex: `Task`, `ApiResponse`)

## Padrões de Gerenciamento de Estado

### Regra de Ouro
- **Dados do servidor** → React Query (`useQuery`, `useMutation`)
- **Estado de UI** → `useState` local

### Exemplos

```typescript
// ✅ CORRETO - Dados do servidor
const { data: tasks } = useQuery({ queryKey: ['tasks'], queryFn: fetchTasks });

// ✅ CORRETO - Estado de UI (modal aberto/fechado)
const [isModalOpen, setIsModalOpen] = useState(false);

// ❌ ERRADO - Usar useState para dados do servidor
const [tasks, setTasks] = useState([]);
```

### Quando usar Context API
- Apenas para temas (dark/light mode)
- Configurações globais de UI
- **NUNCA** para dados que vêm da API

## Regras de Validação

### Obrigatório
- Todo endpoint da API deve validar com Zod.
- Todo formulário deve usar schema Zod.
- Schemas devem estar em `/shared/schema.ts`.

### Exemplo

```typescript
// ❌ ERRADO - Schema duplicado
const taskSchema = z.object({ title: z.string() }); // no frontend
const taskSchema = z.object({ title: z.string() }); // no backend

// ✅ CORRETO
import { taskSchema } from '@/shared/schema';
```

## Padrões de Componentes

### Estrutura padrão

```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ComponentProps {
  // Props aqui
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks no topo
  const [localState, setLocalState] = useState();
  const { data } = useQuery(...);

  // 2. Funções auxiliares
  const handleAction = () => { ... };

  // 3. Early returns (se houver)
  if (!data) return <LoadingSpinner />;

  // 4. JSX principal
  return (
    <div>...</div>
  );
}
```

### Limites
- Máximo 250 linhas por componente.
- Se ultrapassar, extrair sub-componentes.
- Cada componente deve ter UMA responsabilidade.

## Regras de Import

### Ordem obrigatória

```typescript
// 1. Bibliotecas externas
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Componentes internos
import { TaskList } from '@/components/task-list';

// 3. Utilitários
import { calculatePriority } from '@/lib/utils';

// 4. Types
import type { Task } from '@/shared/schema';

// 5. Estilos (se houver CSS modules)
import styles from './component.module.css';
```

## Tratamento de Erros

### API Routes

```typescript
// ✅ CORRETO
try {
  const result = await db.select()...;
  res.json(result);
} catch (error) {
  console.error('Database error:', error);
  res.status(500).json({ error: 'Failed to fetch tasks' });
}
```

### React Query

```typescript
// ✅ CORRETO
const { data, error, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
  retry: 3,
});

if (error) return <ErrorMessage error={error} />;
```
