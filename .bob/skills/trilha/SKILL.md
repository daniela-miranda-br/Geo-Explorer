---
name: trilha
description: Use quando o usuário invocar /trilha <tecnologia> — lê o arquivo dio_explorer/data/trilhas_dio.json e retorna um plano de estudos formatado com os módulos, badges, XP e informações da trilha correspondente.
metadata:
  argument-hint: "<tecnologia>"
---

# Skill: /trilha

Quando ativada, siga os passos abaixo.

## 1. Ler o arquivo de trilhas

Use `read_file` para ler o arquivo:
```
Dio-Class/dio_explorer/data/trilhas_dio.json
```

## 2. Identificar a trilha

A partir do argumento fornecido pelo usuário (ex: `/trilha Python`), busque no JSON uma trilha cujo campo `nome` ou `tecnologia` contenha o termo informado (busca case-insensitive).

- Se encontrar: siga para o passo 3.
- Se não encontrar: responda com uma mensagem amigável listando algumas tecnologias disponíveis no JSON (ex: Python, React, AWS, Docker, Java...).

## 3. Gerar o plano de estudos em Markdown

Monte a resposta com o seguinte formato:

```
# 📚 Plano de Estudos — <nome da trilha>

<emoji-nivel> **Nível:** <nivel>
🛠️ **Tecnologia:** <tecnologia>
📦 **Módulos:** <numero_de_modulos>
⭐ **XP Total:** <xp_total> XP
♾️ **Acesso Vitalício:** Sim/Não
🎥 **Live ao Vivo:** Sim/Não
🔗 **URL:** <url>
🏷️ **Promoção:** <desconto> até <validade>   ← omitir se promocoes for null

---

## 🗺️ Módulos da Trilha

1. Introdução e Fundamentos
2. Configuração do Ambiente
3. Conceitos Essenciais
... (gere um título coerente para cada módulo até o total de numero_de_modulos)

---

## 🏅 Badges Disponíveis

- 🎖️ <badge 1>
- 🎖️ <badge 2>
- 🎖️ <badge 3>

---

> 💡 Use `/desafio <tecnologia>` para gerar um desafio desta trilha!
> 🎓 Ao concluir, use `/certificado <seu-nome> "<trilha>"` para emitir seu certificado.
```

**Emoji por nível:**
- Iniciante → 🟢
- Intermediário → 🟡
- Avançado → 🔴

Os títulos dos módulos devem ser gerados de forma coerente com a tecnologia da trilha (ex: para React: "Componentes e Props", "Hooks: useState e useEffect", "Roteamento com React Router", etc.).
