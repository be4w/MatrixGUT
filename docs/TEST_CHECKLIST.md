# Checklist de Testes Manuais
**Executar ANTES de considerar qualquer mudança como "completa"**

## ✅ Funcionalidades Core

### Criação de Tarefas
- [ ] Abrir formulário de adicionar task
- [ ] Preencher título (ex: "Comprar leite")
- [ ] Preencher descrição (ex: "No mercado X")
- [ ] Definir Impact = 5, Urgency = 4, Tendency = 3
- [ ] Clicar em "Adicionar"
- [ ] **Verificar**: Task aparece na lista
- [ ] **Verificar**: Prioridade calculada = 60 (5×4×3)
- [ ] **Verificar**: Formulário resetou (campos vazios)

### Ordenação por Prioridade
- [ ] Criar 3 tasks com prioridades diferentes:
  - Task A: Impact=5, Urgency=5, Tendency=5 (prioridade=125)
  - Task B: Impact=3, Urgency=3, Tendency=3 (prioridade=27)
  - Task C: Impact=4, Urgency=4, Tendency=4 (prioridade=64)
- [ ] **Verificar**: Ordem exibida = A (125), C (64), B (27)
- [ ] **Verificar**: Badges de prioridade corretos (Alta/Média/Baixa)

### Edição de Tarefas
- [ ] Clicar em "Editar" numa task existente
- [ ] Alterar Impact de 5 para 2
- [ ] Salvar mudanças
- [ ] **Verificar**: Prioridade recalculada corretamente
- [ ] **Verificar**: Task reordenada na lista (se prioridade mudou muito)

### Deleção de Tarefas
- [ ] Clicar em "Deletar" numa task
- [ ] Confirmar ação (se houver modal de confirmação)
- [ ] **Verificar**: Task removida da lista
- [ ] **Verificar**: Não aparece mais ao recarregar página

### Persistência de Dados
- [ ] Criar uma nova task
- [ ] Recarregar página (F5)
- [ ] **Verificar**: Task ainda está lá
- [ ] Fechar navegador completamente
- [ ] Abrir novamente
- [ ] **Verificar**: Dados persistiram

### Modo Foco
- [ ] Clicar em "Modo Foco" (ou equivalente)
- [ ] **Verificar**: Apenas a task de MAIOR prioridade é exibida
- [ ] Marcar task como concluída
- [ ] **Verificar**: Próxima task de maior prioridade aparece
- [ ] **Verificar**: Se não há mais tasks, exibe estado vazio

## ⚠️ Casos de Borda

### Validação de Inputs
- [ ] Tentar criar task sem título
- [ ] **Verificar**: Mensagem de erro aparece
- [ ] **Verificar**: Task NÃO é criada
- [ ] Tentar criar task com título de 1000 caracteres
- [ ] **Verificar**: Validação limita ou avisa

### Tasks com Prioridade Idêntica
- [ ] Criar 2 tasks com exatamente Impact=3, Urgency=3, Tendency=3
- [ ] **Verificar**: Ambas aparecem (ordem pode ser qualquer)
- [ ] **Verificar**: Nenhuma desaparece

### Lista Vazia
- [ ] Deletar todas as tasks
- [ ] **Verificar**: Mensagem "Nenhuma tarefa" aparece
- [ ] **Verificar**: Não crasheia
- [ ] **Verificar**: Formulário ainda funciona para adicionar nova

### Conexão Perdida
- [ ] Desligar Wi-Fi/internet
- [ ] Tentar criar nova task
- [ ] **Verificar**: Mensagem de erro clara
- [ ] Religar internet
- [ ] **Verificar**: App volta a funcionar

## 🔧 Testes de UI/UX

### Responsividade
- [ ] Abrir em tela desktop (>1024px)
- [ ] **Verificar**: Layout adequado
- [ ] Abrir em tablet (768px)
- [ ] **Verificar**: Elementos se adaptam
- [ ] Abrir em mobile (375px)
- [ ] **Verificar**: Navegação acessível

### Performance
- [ ] Criar 50+ tasks
- [ ] **Verificar**: Lista renderiza sem travar
- [ ] **Verificar**: Scroll suave
- [ ] Deletar tasks em massa
- [ ] **Verificar**: UI continua responsiva

## 📝 Registro de Testes
Sempre anotar:
- Data do teste: ___________
- Quem testou: ___________
- Bugs encontrados: ___________
- Status: [ ] Passou | [ ] Falhou
