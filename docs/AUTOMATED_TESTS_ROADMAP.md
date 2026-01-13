# Roadmap de Testes Automatizados
**NÃO implementar agora - apenas documentar o que seria crítico testar**

## Prioridade 1: Testes de Integração (API)

### Por que começar aqui?
- Garantem que backend não quebra.
- Protegem a lógica de negócio (priorização GUT).
- Independem de mudanças de UI.

### Testes Essenciais

#### POST /api/tasks
- Cria task com dados válidos e verifica cálculo de prioridade.
- Rejeita task sem título.
- Rejeita valores GUT fora do range 1-5.

#### GET /api/tasks
- Retorna tasks ordenadas por prioridade DESC.

#### PATCH /api/tasks/:id
- Atualiza task e recalcula prioridade.
- Retorna 404 para task inexistente.

#### DELETE /api/tasks/:id
- Deleta task existente.
- Verifica persistência no banco.

## Prioridade 2: Testes de Componentes (Frontend)

### Por que em segundo?
- Garantem que UI renderiza dados corretamente.
- Protegem contra regressões visuais.
- Isolam bugs de componentes específicos.

### Ferramentas Sugeridas
- **Vitest** (já compatível com Vite)
- **React Testing Library**

### Testes Essenciais

#### `add-task-form.tsx`
- Valida título obrigatório e exibe erro.
- Dispara mutation `onSuccess` ao submeter corretamente.

#### `task-list.tsx`
- Renderiza itens na ordem correta, exibindo prioridade.
- Exibe estado vazio ("Nenhuma tarefa") corretamente.

## Prioridade 3: Testes E2E (Fluxos Completos)

### Por que por último?
- Mais lentos e frágeis.
- Essenciais para validar fluxos críticos ponta-a-ponta.

### Ferramentas Sugeridas
- **Playwright**

### Cenário Principal
- Fluxo completo: Usar a UI para criar duas tasks (alta e baixa prioridade) e verificar se aparecem na ordem certa na tela.

## Estimativas de Tempo

| Prioridade | Esforço Estimado | Impacto |
|------------|------------------|---------|
| P1: API Tests | 4-6 horas | 🔴 Alto |
| P2: Component Tests | 6-8 horas | 🟡 Médio |
| P3: E2E Tests | 8-10 horas | 🟢 Baixo |

**Recomendação**: Começar com P1 antes de adicionar multi-user.
