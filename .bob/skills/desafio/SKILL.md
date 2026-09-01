---
name: desafio
description: Use quando o usuário invocar /desafio <tecnologia> [nivel] — gera um desafio de código aleatório com enunciado, dicas e esqueleto de código baseado na tecnologia e nível escolhidos.
metadata:
  argument-hint: "<tecnologia> [Iniciante|Intermediário|Avançado]"
---

# Skill: /desafio

Quando ativada, siga os passos abaixo.

## 1. Extrair tecnologia e nível dos argumentos

O usuário pode chamar de duas formas:
- `/desafio Python` → tecnologia: Python, nível: sortear aleatoriamente
- `/desafio React Avançado` → tecnologia: React, nível: Avançado

Mapeamento de nível (case-insensitive):
- "iniciante" → Iniciante 🟢
- "intermediario" / "intermediário" → Intermediário 🟡
- "avancado" / "avançado" → Avançado 🔴
- Não informado → escolha aleatória entre os três

## 2. Gerar o desafio

Crie um desafio de código **coerente com a tecnologia e o nível** informados. O desafio deve ser:
- **Iniciante:** conceitos básicos, sintaxe, lógica simples (ex: função, loop, condição)
- **Intermediário:** padrões, hooks, APIs, integração, estruturas de dados
- **Avançado:** arquitetura, performance, concorrência, design patterns, otimização

Gere um `seed` aleatório de 4 dígitos para identificar o desafio (ex: #4821).

## 3. Responder no seguinte formato Markdown

```
# ⚔️ Desafio DIO — <Título do Desafio>

<emoji-nivel> **Nível:** <nivel>
🛠️ **Tecnologia:** <tecnologia>
🎲 **Seed:** #<seed>

---

## 📋 Enunciado

<descrição clara do problema a ser resolvido>

---

## 💡 Dicas

1. <dica 1>
2. <dica 2>
3. <dica 3>

---

## 🧩 Esqueleto de Código

```<linguagem>
<código esqueleto com comentários // seu código aqui>
```

---

> 🏆 Conseguiu resolver? Use `/certificado <seu-nome> "<titulo-do-desafio>"` para registrar sua conquista!
```

## 4. Regras de qualidade

- O título deve ser criativo e em português (ex: "Gerenciador de Tarefas Reativo", "Pipeline Assíncrono", "Cache LRU do Zero")
- O esqueleto deve ter a estrutura básica com comentários indicando onde implementar
- As dicas devem ser úteis mas não entregar a solução
- O enunciado deve ter critérios de aceite claros (entrada esperada / saída esperada)
- Varie os desafios — não repita o mesmo padrão toda vez
