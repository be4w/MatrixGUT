# Roadmap Multi-User
**STATUS: Planejamento apenas - NÃO executar ainda**

## Decisão 1: Estratégia de Autenticação

### Opção A: Passport.js (Já Instalado)
**Prós:**
- Biblioteca já está no `package.json`.
- Controle total sobre sessões.
- Sem dependências externas pagas.

**Contras:**
- Precisa implementar UI de login/registro do zero.
- Gerenciar segurança (bcrypt, salt, reset de senha) manualmente é arriscado.
- Mais código para manter.

### Opção B: Clerk.dev (Recomendado) 🚀
**Prós:**
- UI pronta e segura.
- Gerenciamento de users fora do banco (menos risco).
- Webhooks e integração fácil com React.

**Contras:**
- Serviço externo (vendor lock-in relativo).
- Limites do plano grátis (mas alto o suficiente para MVP).

### 🎯 Recomendação
**Clerk.dev** é o melhor custo-benefício para velocidade e segurança.

## Decisão 2: Migração do Schema do Banco

### Mudanças Necessárias
1. **Nova Tabela `users`**: ID (texto vindo do Auth Provider), Email.
2. **Alterar Tabela `tasks`**: Adicionar coluna `userId` (Foreign Key).
3. **Migration**: Script SQL para criar tabelas e migrar dados legados (atribuir tasks atuais a um user padrão ou deletar).

## Decisão 3: Estratégia de Dados

### Alterações na API
- Todas as rotas `/api/tasks` devem filtrar por `userId`.
- `WHERE user_id = current_user_id`.

### Alterações no Frontend
- React Query Keys devem incluir o `userId` para evitar cache pollution entre usuários (se houver troca de contas no mesmo browser).
- `queryKey: ['tasks', userId]`

## Checklist de Implementação (FUTURO)

### Fase 1: Setup Auth
- [ ] Configurar Provider (Clerk ou Passport).
- [ ] Criar telas de Login/SignUp.

### Fase 2: Banco de Dados
- [ ] Criar tabela Users.
- [ ] Adicionar UserID na tabela Tasks.
- [ ] Migrar dados existentes.

### Fase 3: Backend
- [ ] Criar Middleware de Auth.
- [ ] Proteger rotas com o Middleware.

### Fase 4: Frontend
- [ ] Atualizar chamadas de API.
- [ ] Testar fluxo E2E (Login -> Criar Task -> Logout -> Login Outro User -> Lista Vazia).
