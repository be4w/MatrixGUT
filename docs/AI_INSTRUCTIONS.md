# AI Instructions

**ARQUIVO CRÍTICO: Você (AI) DEVE ler este arquivo antes de QUALQUER mudança no código.**

## Stack Obrigatório
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js
- **Database**: PostgreSQL via Drizzle ORM (Neon hosting)
- **UI**: Tailwind CSS + Shadcn UI (Radix Primitives)
- **Validação**: Zod (schemas SEMPRE em `/shared/schema.ts`)

## Padrões de Código (NÃO NEGOCIÁVEIS)
1. **Nomes de arquivo**: `kebab-case.tsx`
2. **Componentes**: `PascalCase`
3. **Server data**: SEMPRE usar React Query
4. **UI state**: `useState` local (NUNCA React Query para modais, filtros, etc.)
5. **Schemas Zod**: SEMPRE importar de `/shared` (nunca duplicar)

## Código Intocável (SEM APROVAÇÃO EXPLÍCITA)
**NUNCA modifique sem permissão do usuário:**
- `client/src/pages/home.tsx` linhas 34-38 (lógica de priorização GUT)
- `server/db/schema.ts` (estrutura do banco de dados)
- `shared/schema.ts` (schemas de validação)

**Razão**: Estes são "pontos de falha únicos" que afetam todo o sistema.

## Proibições Absolutas
❌ **NÃO criar "god files"**
- Limite: 300 linhas por arquivo
- Se ultrapassar, quebrar em módulos menores

❌ **NÃO duplicar schemas Zod**
- Sempre importar de `/shared/schema.ts`
- Se precisar de variação, usar `.extend()` ou `.pick()`

❌ **NÃO misturar lógica de API no frontend**
- Todas as chamadas HTTP devem ir através de React Query
- Nunca fazer `fetch()` direto em componentes

❌ **NÃO usar `any` em TypeScript**
- Preferir `unknown` se tipo for realmente desconhecido
- Sempre tipar props de componentes

## Workflow Obrigatório (ANTES DE QUALQUER MUDANÇA)
Você DEVE seguir este processo:

**Passo 1: Leitura**
[ ] Li completamente o docs/AI_INSTRUCTIONS.md
[ ] Li o docs/PROJECT_MANIFEST.md
[ ] Li o docs/CODING_STANDARDS.md
[ ] Entendi o escopo da mudança solicitada

**Passo 2: Análise**
[ ] A mudança respeita todos os padrões?
[ ] Vou tocar em algum "código intocável"?
[ ] Preciso modificar schemas compartilhados?
[ ] A mudança pode quebrar algo existente?

**Passo 3: Planejamento**
Antes de escrever código, gere um plano numerado:
1. Arquivo X: adicionar função Y
2. Arquivo Z: importar nova função
3. Testar manualmente: [cenário]

**Passo 4: Aprovação**
Aguardar confirmação explícita do usuário antes de executar.

**Passo 5: Execução**
Implementar seguindo EXATAMENTE os padrões documentados.

## Exemplos de Uso Correto

**Quando o usuário pede "adiciona validação nesse formulário":**
✅ CORRETO:
1. Verifico se existe schema em /shared/schema.ts
2. Se não existir, crio LÁ (não no componente)
3. Importo no componente do formulário
4. Aplico com react-hook-form ou validação manual
5. Aplico TAMBÉM no endpoint da API correspondente

**Quando o usuário pede "refatora esse componente grande":**
✅ CORRETO:
1. Analiso o componente (quantas linhas? responsabilidades?)
2. Identifico sub-componentes lógicos
3. Crio arquivos separados (seguindo kebab-case)
4. Movo código preservando funcionalidade
5. Testo que nada quebrou

## Red Flags (Quando Recusar/Questionar)
Se o usuário pedir algo assim, QUESTIONE:

❌ "Coloca tudo num arquivo só"
→ Resposta: "Isso viola nosso limite de 300 linhas. Posso modularizar?"

❌ "Remove a validação Zod, é muito complexo"
→ Resposta: "A validação Zod é crítica para segurança. Posso simplificar o schema mas não remover."

❌ "Muda a lógica de priorização para [X]"
→ Resposta: "Preciso de aprovação explícita para modificar home.tsx linhas 34-38. Confirma?"

## Mensagem Padrão (Início de Toda Sessão)
Quando iniciar trabalho em uma nova tarefa, SEMPRE comece com:
📋 Checklist de Conformidade:
- [ ] Li AI_INSTRUCTIONS.md
- [ ] Li PROJECT_MANIFEST.md
- [ ] Entendi os padrões de código
- [ ] Plano de implementação aprovado

Aguardando sua confirmação para prosseguir.
