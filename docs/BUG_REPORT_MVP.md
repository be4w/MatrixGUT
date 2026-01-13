# Relatório de Bugs (MVP Validation)
**Data:** 12/01/2026

## 🚨 Críticos (Showstoppers)

### 1. Dados Corrompidos: `Impact` está `undefined`
- **STATUS: RESOLVIDO ✅**
- **Causa Real:** Servidor Node.js estava rodando versão antiga do código (pré-migração) em memória, ignorando a nova coluna.
- **Correção:** Restart do servidor (`npm run dev`) + Defensive Coding no frontend.

### 2. App Crash ao Expandir/Editar
- **STATUS: RESOLVIDO ✅**
- **Correção:** Adicionado fallback `(value || 0).toString()` em todos os Selects.

### 3. Ordenação Falha
- **STATUS: RESOLVIDO ✅**
- **Correção:** Com os dados corretos, a ordenação voltou a funcionar naturalmente.

## 🟡 Funcionais

- **Modo Foco em Estado Inválido:** Mostra Urgência e Tendência, mas sem Impacto e com Score NaN. Não esconde a task inválida.

## ✅ O que funcionou
- **Criação:** Backend aceita requisição (cria ID).
- **Deleção:** CRUD de delete funcionando.
- **Persistência:** Dados sobrevivem ao refresh (mesmo que corrompidos).

## 🛠 Plano de Correção Sugerido

1. **Investigar API/DB:** Verificar se o banco realmente tem a coluna `impact` populada.
2. **Corrigir Frontend (Defensive Coding):** Adicionar checks para não crashear se valor for nulo.
3. **Migration Fix:** Se os dados antigos não migraram, rodar script de correção.
